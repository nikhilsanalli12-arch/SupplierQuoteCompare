import { Supplier } from '../models/Supplier.js';

/**
 * @route   GET /api/suppliers
 * @desc    Get all suppliers with search and filters
 */
export const getSuppliers = async (req, res) => {
  try {
    const { search, category, location, status, sort } = req.query;

    const query = {};

    // Keyword search across name, contact, email, city, category
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { contactPerson: searchRegex },
        { email: searchRegex },
        { city: searchRegex },
        { category: searchRegex }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Location / City filter
    if (location && location !== 'All') {
      query.city = new RegExp(location, 'i');
    }

    // Sort order
    let sortOption = { createdAt: -1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'activeQuotes') sortOption = { activeQuotes: -1 };

    const suppliers = await Supplier.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error retrieving suppliers',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/suppliers/:id
 * @desc    Get single supplier by ID
 */
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: `Supplier not found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: supplier
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching supplier details',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/suppliers
 * @desc    Create a new supplier
 */
export const createSupplier = async (req, res) => {
  try {
    const {
      name,
      category,
      contactPerson,
      email,
      phone,
      address,
      city,
      country,
      rating,
      paymentTerms,
      status,
      notes
    } = req.body;

    // Field presence validation
    if (!name || !category || !contactPerson || !email || !phone || !address || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, category, contact person, email, phone, address, and city.'
      });
    }

    // Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // Check for existing supplier with the same email
    const existing = await Supplier.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A supplier with email "${email}" already exists (${existing.name}).`
      });
    }

    const supplier = await Supplier.create({
      name: name.trim(),
      category: category.trim(),
      contactPerson: contactPerson.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      country: (country || 'United States').trim(),
      rating: rating ? Number(rating) : 4.5,
      paymentTerms: paymentTerms || 'Net 30',
      status: status || 'Active',
      notes: notes ? notes.trim() : ''
    });

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: supplier
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Validation failed while creating supplier',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/suppliers/:id
 * @desc    Update an existing supplier
 */
export const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: `Supplier not found with id ${req.params.id}`
      });
    }

    // Check email uniqueness if email is changed
    if (req.body.email && req.body.email.toLowerCase() !== supplier.email) {
      const emailExists = await Supplier.findOne({ 
        email: req.body.email.toLowerCase(),
        _id: { $ne: req.params.id }
      });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: `Another supplier is already registered with email "${req.body.email}".`
        });
      }
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Supplier updated successfully',
      data: updatedSupplier
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update supplier',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/suppliers/:id
 * @desc    Delete supplier with safety check
 */
export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: `Supplier not found with id ${req.params.id}`
      });
    }

    // Safe deletion protection: prevent deleting if activeQuotes > 0 unless forced
    const force = req.query.force === 'true';
    if (supplier.activeQuotes > 0 && !force) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete supplier "${supplier.name}" because they have ${supplier.activeQuotes} active quotation(s) linked. Please delete or reassign the quotations first.`,
        activeQuotes: supplier.activeQuotes
      });
    }

    await Supplier.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Supplier "${supplier.name}" successfully removed.`,
      data: { id: req.params.id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete supplier',
      error: error.message
    });
  }
};
