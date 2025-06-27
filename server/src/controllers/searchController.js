import Crop from '../models/CropModel.js';
import bmhsSearch from '../utils/bmhs.js';

const searchCrops = async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Query parameter is required.' });

    try {
        const crops = await Crop.find({});
        // Filter crops using BMHS on crop name (case-insensitive)
        const results = crops.filter(crop =>
            bmhsSearch(crop.name.toLowerCase(), query.toLowerCase()) !== -1
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

export default { searchCrops };
