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
            .populate(company)
            .populate(executive)
            .populate(state)
            .populate(branch)
        const newArr = company.map(data=>{
            return {
                branchName : data.branchName,
                status : data.status,
                company : data.company.name,
                executive : data.executive.name,
                state : data.state.name,
                branch : data.branch.name,
            }
        })
        response.status(201).json(newArr)
    }
    catch (error) {
        next(error)
    }
}