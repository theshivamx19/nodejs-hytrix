import Companyinfo from "../../models/liseReg/CompanyInfo.js"

export const createCompanyInfo = async (request, response, next) => {
    try {
        const data = request.body
        const { branchName, status, company, executive, state, branch } = data
        const companyInfo = {
            branchName, status, company, executive, state, branch
        }
        const newCompanyInfo = new Companyinfo(companyInfo)
        await newCompanyInfo.save()
        response.status(201).json(newCompanyInfo)
    } catch (error) {
        next(error)
    }
}

export const companyInfoGetting = async (request, response, next) => {
    try {
        const company = await Companyinfo.find({})
        response.status(201).json(company)
    }
    catch (error) {
        next(error)
    }
}