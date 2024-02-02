import express from 'express'

import { createApplicationDetail, appDetailGetting } from '../controllers/liseRegController/ApplicationDetails.js'
import { createCompanyInfo, companyInfoGetting } from '../controllers/liseRegController/CompanyInfo.js'
import { createDocCollection, docCollectionGetting } from '../controllers/liseRegController/DocumentCollection.js'
import { createExpenseDetail, expenseDetailGetting } from '../controllers/liseRegController/ExpenseDetails.js'
import { createInvoiceDetail, invoiceDetailGetting } from '../controllers/liseRegController/InvoiceDetails.js'
import { createLicenseDetail, licenseDetailGetting } from '../controllers/liseRegController/LicenseDetails.js'
import { createNameRate, nameRateGetting } from '../controllers/liseRegController/NameRate.js'
import { upload } from '../middlewares/multerConfig.js'

const router = express.Router()

router.post('/createApplicationDetail', upload.single('acknowledge'), createApplicationDetail)
router.get('/appDetailGetting', appDetailGetting)

router.post('/createCompanyInfo', createCompanyInfo)
router.get('/companyInfoGetting', companyInfoGetting)

router.post('/createDocCollection', upload.single('documents'), createDocCollection)
router.get('/docCollectionGetting', docCollectionGetting)

router.post('/createExpenseDetail', createExpenseDetail)
router.get('/expenseDetailGetting', expenseDetailGetting)

router.post('/createInvoiceDetail', createInvoiceDetail)
router.get('/invoiceDetailGetting', invoiceDetailGetting)

router.post('/createLicenseDetail', createLicenseDetail)
router.get('/licenseDetailGetting', licenseDetailGetting)

router.post('/createNameRate', createNameRate)
router.get('/nameRateGetting', nameRateGetting)




export default router