import NameRate from '../../models/liseReg/NameRate.js'

export const createNameRate = async (request, response, next) => {
    try {
        const data = request.body
        const { regNo, rate, status, company, executive, state, branch } = data
        const nameRate = {
            regNo, rate, status, company, executive, state, branch
        }
        const newNameRate = new NameRate(nameRate)
        await newNameRate.save()
        response.status(201).json(newNameRate)
    } catch (error) {
        next(error)
    }
}

export const nameRateGetting = async (requxest, response, next) => {
    try {
        const nameRate = await NameRate.find({})
        response.status(201).json(nameRate)
    }
    catch (error) {
        next(error)
    }
}   