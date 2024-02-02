import LicenseDetails from '../../models/liseReg/LicenseDetails.js'



export const createLicenseDetail = async (request, response, next) => {
    try {
        const data = request.body
        const { licenseNumber, dateOfIssue, renewalDate, expireDate, licenseUpload } = data
        const licenseDetail = {
            licenseNumber, dateOfIssue, renewalDate, expireDate, licenseUpload
        }
        const newLicenseDetail = new Licensedetails(licenseDetail)
        await newLicenseDetail.save()
        response.status(201).json(newLicenseDetail)
    } catch (error) {
        next(error)
    }
}

export const licenseDetailGetting = async (request, response, next) => {
    try {
        const license = await LicenseDetails.find({})
        response.status(201).json(license)
    }
    catch (error) {
        next(error)
    }
}   