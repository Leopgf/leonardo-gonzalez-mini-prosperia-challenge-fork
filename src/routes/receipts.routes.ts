import { Router } from 'express';
import multer from 'multer';
import {
  createReceipt,
  getAllReceipts,
  getReceipt,
  reparseReceipt
} from '../controllers/receipts.controller.js';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('/', upload.single('file'), createReceipt);
router.get('/all', getAllReceipts);
router.get('/:id', getReceipt);
router.post('/:id/reparse', reparseReceipt);

export default router;
