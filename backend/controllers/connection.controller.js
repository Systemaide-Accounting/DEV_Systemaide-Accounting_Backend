export const getConnection = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            // message: "Connected to the server",
            message: "Connected to SYSTEMAIDE server",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};