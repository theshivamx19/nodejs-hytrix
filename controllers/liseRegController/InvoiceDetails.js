import InvoiceDetails from '../../models/liseReg/InvoiceDetails.js'


export const createInvoiceDetail = async (request, response, next) => {
    try {
        const data = request.body
        const { invoiceType, invoiceDate, invoiceNumber, submissionDate } = data
        const invoiceDetail = {
            invoiceType, invoiceDate, invoiceNumber, submissionDate
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
        const invoice = await InvoiceDetails.find({})
        response.status(201).json(invoice)
    }
    catch (error) {
        next(error)
    }
}   