export const protect = async (req, res, next) => {
    try {
        const { userId } = req.auth();
        if(!userId) {
            return res.json({success:false, message: "not authenticated"})
        }
        next()
    } catch (error) {
        console.log(error);
        return res.json({success:false, message: error.message})
    }
}