import crypto from "crypto"

const generateEmailVerificationCodeAndExpire = () => {
    const token = crypto.randomBytes(20).toString("hex")

    const verificationCode = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")

    // expire the code in 30 minutes
    const verificationExpire = Date.now() + 30 * 60 * 1000

    return {
        verificationCode,
        verificationExpire
    }
}

export default generateEmailVerificationCodeAndExpire