import Notification from "../model/notification.model.js";

export const allnotif = async (req, res) => {
    try {
        const notifications = await Notification.find({ to: req.params.userId })
        .populate({
          path: 'from',  // Populating the 'from' field
          select: 'gender section profilePhoto username', // Select specific user fields
        });
        res.status(200).json(notifications);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications' });
      }
}
export const deletenotif = async (req, res) => {
    try {
        await Notification.deleteMany({ to: req.params.userId });
        res.status(200).json({ message: 'Notifications cleared' });
      } catch (error) {
        res.status(500).json({ message: 'Error clearing notifications' });
      }
}