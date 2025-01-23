const User = require('../models/User')

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Username sudah digunakan' 
      });
    }

    // Create new user
    const user = await User.create({ username, password });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan', 
      error: error.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Username atau password salah' 
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Username atau password salah' 
      });
    }

    res.json({
      success: true,
      message: 'Login berhasil',
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan', 
      error: error.message 
    });
  }
};

// Tambahkan endpoint logout
exports.logout = async (req, res) => {
  try {
    await req.user.removeToken();
    res.json({ message: 'Logout berhasil' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Middleware untuk proteksi route
exports.protect = async (req, res, next) => {
  try {
    console.log('Headers:', req.headers);
    let token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Tidak ada token. Akses ditolak'
      });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Cek apakah user masih ada
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Tambahkan user ke request
    req.user = user;
    next();

  } catch (error) {
    console.error('Protect middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid'
    });
  }
}; 