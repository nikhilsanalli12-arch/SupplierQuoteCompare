import express from 'express';
import {
  getQuotations,
  getQuotationById,
  createQuotation,
  updateQuotation,
  deleteQuotation,
  compareQuotations
} from '../controllers/quotationController.js';

const router = express.Router();

router.route('/')
  .get(getQuotations)
  .post(createQuotation);

// Compare route must be declared before /:id parameter route
router.route('/compare')
  .get(compareQuotations)
  .post(compareQuotations);

router.route('/:id')
  .get(getQuotationById)
  .put(updateQuotation)
  .delete(deleteQuotation);

export default router;
