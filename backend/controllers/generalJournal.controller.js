import GeneralJournal from "../models/generalJournal.model.js";
import mongoose from "mongoose";

export const getAllGeneralJournal = async (req, res, next) => {
	try {
		let journals = await GeneralJournal.find({
			isDeleted: { $ne: true },
		}).populate("location");

		res.status(200).json({
			success: true,
			data: journals,
		});
	} catch (error) {
		next(error);
	}
};

export const createGeneralJournal = async (req, res, next) => {
	try {
		const journal = { ...req.body };

		// Remove restricted fields
		delete journal.isDeleted;
		delete journal.deletedAt;

		const newJournal = await GeneralJournal.create(journal);

		res.status(201).json({
			success: true,
			data: {
				newJournal,
			},
		});
	} catch (error) {
		next(error);
	}
};

export const getGeneralJournalById = async (req, res, next) => {
	try {
		const { id: journalId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(journalId)) {
			return res.status(404).json({
				success: false,
				message: "Invalid journal ID",
			});
		}

		const journal = await GeneralJournal.findOne({
			_id: journalId,
			isDeleted: { $ne: true },
		}).populate("location");

		if (!journal) {
			return res.status(404).json({
				success: false,
				message: "Journal not found",
			});
		}

		res.status(200).json({
			success: true,
			data: journal,
		});
	} catch (error) {
		next(error);
	}
};

export const updateGeneralJournal = async (req, res, next) => {
	try {
		const { id: journalId } = req.params;
		const journal = { ...req.body };

		if (!mongoose.Types.ObjectId.isValid(journalId)) {
			return res.status(404).json({
				success: false,
				message: "Invalid journal ID",
			});
		}

		const updateJournal = await GeneralJournal.findOneAndUpdate(
			{ _id: journalId, isDeleted: { $ne: true } },
			journal,
			{ new: true, runValidators: true }
		);

		if (!updateJournal) {
			return res.status(404).json({
				success: false,
				message: "Journal not found",
			});
		}

		res.status(200).json({
			success: true,
			data: journal,
		});
	} catch (error) {
		next(error);
	}
};

export const deleteGeneralJournal = async (req, res, next) => {
    try {
        const { id: journalId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(journalId)) {
            return res.status(404).json({
                success: false,
                message: "Invalid journal ID",
            });
        }

        const deletedJournal = await GeneralJournal.findOneAndUpdate(
            { _id: journalId, isDeleted: { $ne: true } },
            { isDeleted: true, deletedAt: new Date() },
            { new: true, runValidators: true }
        );

		if (!deletedJournal) {
            return res.status(404).json({
                success: false,
                message: "Journal not found",
            });
        }

		if (deletedJournal.isDeleted) {
			return res.status(404).json({
				success: false,
				message: "Journal is already deleted",
			});
		}

        res.status(200).json({
            success: true,
            data: deletedJournal,
        });
    } catch (error) {
        next(error);
    }
}

export const restoreGeneralJournal = async (req, res, next) => {
	try {
		const { id: journalId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(journalId)) {
			return res.status(404).json({
				success: false,
				message: "Invalid journal ID",
			});
		}

		const restoredJournal = await GeneralJournal.findOneAndUpdate(
			{ _id: journalId, isDeleted: true },
			{ isDeleted: false, restoredAt: new Date() },
			{ new: true, runValidators: true }
		);

		if (!restoredJournal) {
			return res.status(404).json({
				success: false,
				message: "Journal not found",
			});
		}

		if (!restoredJournal.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Journal is not deleted",
            });
        }

		res.status(200).json({
			success: true,
			data: restoredJournal,
		});
	} catch (error) {
		next(error);
	}
}
