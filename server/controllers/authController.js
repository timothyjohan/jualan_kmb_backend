const User = require('../models/User')

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Username sudah digunakan' 
      });
    }

    // Create new user
    const user = new User({ username, password });
    const token = await user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal melakukan registrasi',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah'
      });
    }

    // Generate token
    const token = await user.generateAuthToken();

    res.json({
      success: true,
      message: 'Login berhasil',
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal melakukan login',
      error: error.message
    });
  }
};

const logout = async (req, res) => {
  try {
    // Remove current token
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();

    res.json({
      success: true,
      message: 'Logout berhasil'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal melakukan logout',
      error: error.message
    });
  }
};

const validate = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Token valid'
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token tidak valid',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  validate
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