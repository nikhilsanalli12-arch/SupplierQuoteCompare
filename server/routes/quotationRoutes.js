import express from 'express';
import {
  getQuotations,
  getQuotationById,
  createQuotation,
  updateQuotation,
  deleteQuotation
} from '../controllers/quotationController.js';

const router = express.Router();

router.route('/')
  .get(getQuotations)
  .post(createQuotation);

router.route('/:id')
  .get(getQuotationById)
  .put(updateQuotation)
  .delete(deleteQuotation);

export default router;
