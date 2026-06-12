const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllAssets = async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      include: {
        allocations: {
          include: { user: { select: { id: true, name: true, email: true } } }
        }
      }
    });
    res.status(200).json({ success: true, data: assets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch assets', error: error.message });
  }
};

exports.createAsset = async (req, res) => {
  try {
    const { asset_name, asset_type, serial_number } = req.body;
    const asset = await prisma.asset.create({
      data: { asset_name, asset_type, serial_number }
    });
    
    await prisma.assetHistory.create({
      data: { asset_id: asset.id, action: 'Added to inventory', notes: 'Initial Registration' }
    });

    res.status(201).json({ success: true, data: asset, message: 'Asset created' });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'An asset with this serial number already exists.' });
    }
    res.status(500).json({ success: false, message: 'Failed to create asset', error: error.message });
  }
};

exports.allocateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    const allocation = await prisma.assetAllocation.create({
      data: { asset_id: parseInt(id), user_id: parseInt(user_id) }
    });

    await prisma.assetHistory.create({
      data: { asset_id: parseInt(id), action: 'Allocated', notes: `Allocated to user ID ${user_id}` }
    });

    res.status(200).json({ success: true, data: allocation, message: 'Asset allocated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to allocate asset', error: error.message });
  }
};
