import UserModel from "../models/user.model.js";

export const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", role, userName, email } = req.query;
        const filter = {};
        if (role) filter.role = role;
        if (userName) filter.userName = new RegExp(userName, "i");
        if (email) filter.email = new RegExp(email, "i");

        const users = await UserModel.find(filter)
            .select("-password") // Exclude password
            .sort({ [sortBy]: order === "asc" ? 1 : -1 }) // Sorting
            .skip((page - 1) * limit) // Pagination
            .limit(parseInt(limit));

        const totalUsers = await UserModel.countDocuments(filter);
        res.status(200).json({
            totalUsers,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            users,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
