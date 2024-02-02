import DocumentCollection from '../../models/liseReg/DocumentCollection'

export const createDocCollection = async (request, response, next) => {
    try {
        const data = request.body
        const { documents, docReqDate, docRegFollow, docReviewDate } = data
        const docCollection = {
            documents, docReqDate, docRegFollow, docReviewDate
        }
        const newDocCollection = new DocumentCollection(docCollection)
        await newDocCollection.save()
        response.status(201).json(newDocCollection)
    } catch (error) {
        next(error)
    }
}

export const docCollectionGetting = async (request, response, next) => {
    try {
        const documents = await DocumentCollection.find({})
        response.status(201).json(documents)
    }
    catch (error) {
        next(error)
    }
}