import { config } from 'dotenv';
config();

async function fixAddressSlugs() {
  try {
    const { dbConnect } = await import("../lib/mongodb.js");
    const User = (await import("../models/User.js")).default;
    await dbConnect();
    console.log("Connected to database");

    const users = await User.find({ "addresses.0": { $exists: true } });
    console.log(`Found ${users.length} users with addresses`);

    let updatedCount = 0;
    for (const user of users) {
      let userUpdated = false;
      
      for (const address of user.addresses) {
        // Skip addresses missing required fields
        if (!address.street || !address.city || !address.state || !address.zipCode) {
          console.warn(`Skipping address for user ${user._id} due to missing required fields:`, address);
          continue;
        }
        if (!address.slug) {
          const timestamp = Date.now();
          const addressString = `${address.street}-${address.city}-${address.state}-${address.zipCode}`;
          address.slug = `${addressString.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${timestamp}`;
          userUpdated = true;
          console.log(`Added slug to address: ${address.slug}`);
        }
      }
      
      if (userUpdated) {
        await user.save();
        updatedCount++;
      }
    }

    console.log(`Updated ${updatedCount} users with address slugs`);
    process.exit(0);
  } catch (error) {
    console.error("Error fixing address slugs:", error);
    process.exit(1);
  }
}

fixAddressSlugs(); 