// pages/api/messages.js
export default function handler(req, res) {
    const { page } = req.query;
    const messages = Array.from({ length: 20 }, (_, i) => ({
      id: (page - 1) * 20 + i + 1,
      text: `Message ${(page - 1) * 20 + i + 1}`,
    }));
    
    res.status(200).json(messages);
  }
  