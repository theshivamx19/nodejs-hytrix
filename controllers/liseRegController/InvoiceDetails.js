import Invoicedetail from '../../models/liseReg/InvoiceDetails.js'


export const createInvoiceDetail = async (request, response, next) => {
    try {
        const data = request.body
        const { invoiceType, invoiceDate, invoiceNumber, submissionDate, status, company, executive, state, branch } = data
        const invoiceDetail = {
            invoiceType, invoiceDate, invoiceNumber, submissionDate, status, company, executive, state, branch
        }
        const newInvoiceDetail = new Invoicedetail(invoiceDetail)
        await newInvoiceDetail.save()
        response.status(201).json(newInvoiceDetail)
    } catch (error) {
        next(error)
    }
}

export const invoiceDetailGetting = async (request, response, next) => {
    try {
        const invoice = await Invoicedetail.find({})
        response.status(201).json(invoice)
    }
    catch (error) {
        next(error)
    }
}   