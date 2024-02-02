import Expensedetails from '../../models/liseReg/ExpenseDetails'

export const createExpenseDetail = async (request, response, next) => {
    try {
        const data = request.body
        const { challlanFees, challanNumber, challanDate, challanUpload, directExpenses} = data
        const expenseDetail = {
            challlanFees, challanNumber, challanDate, challanUpload, directExpenses
        }
        const newExpenseDetail = new Expensedetails(expenseDetail)
        await newExpenseDetail.save()
        response.status(201).json(newExpenseDetail)
    } catch (error) {
        next(error)
    }
}

export const expenseDetailGetting = async (request, response, next) => {
    try {
        const expenses = await Expensedetails.find({})
        response.status(201).json(expenses)
    }
    catch (error) {
        next(error)
    }
}