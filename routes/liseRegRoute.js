import express from 'express'

import { createApplicationDetail, appDetailGetting } from '../controllers/liseRegController/ApplicationDetails'
import { createCompanyInfo, companyInfoGetting } from '../controllers/liseRegController/CompanyInfo'
import { createDocCollection, docCollectionGetting } from '../controllers/liseRegController/DocumentCollection'
import { createExpenseDetail, expenseDetailGetting } from '../controllers/liseRegController/ExpenseDetails'
import { createInvoiceDetail, invoiceDetailGetting } from '../controllers/liseRegController/InvoiceDetails'
import { createLicenseDetail, licenseDetailGetting } from '../controllers/liseRegController/LicenseDetails'
import { createNameRate, nameRateGetting } from '../controllers/liseRegController/NameRate'

const router = express.Router()

router.post('/createApplicationDetail', createApplicationDetail)
router.get('/appDetailGetting', appDetailGetting)

router.post('/createCompanyInfo', createCompanyInfo)
router.get('/companyInfoGetting', companyInfoGetting)

router.post('/createDocCollection', createDocCollection)
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