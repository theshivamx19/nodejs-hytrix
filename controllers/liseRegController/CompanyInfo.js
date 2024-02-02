import Companyinfo from "../../models/liseReg/CompanyInfo.js"

export const createCompanyInfo = async (request, response, next) => {
    try {
        const branch = request.body.branch
        const newCompanyInfo = await Companyinfo.create({ branch })
        await response.status(201).json(newCompanyInfo)
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