import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import colors from "colors";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { connectDB } from "../../config/db.js";
import { encryptTIN } from "../../helpers/encryptDecryptUtils.js";

// import models
import Branch from "../../models/branch.model.js";
import Location from "../../models/location.model.js";
import User from "../../models/user.model.js";
import GeneralJournal from "../../models/generalJournal.model.js";

// Configure environment variables
dotenv.config();

// Dynamic import for models
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsDir = path.join(__dirname, "../../models");

// Map model names to their imported classes
const modelMap = {
  "Branch": Branch,
  "Location": Location,
  "User": User,
  "GeneralJournal": GeneralJournal,
  // Add other models here
};

// Load models dynamically
const loadModels = async () => {
  try {
    const modelFiles = fs
      .readdirSync(modelsDir)
      .filter((file) => file.endsWith(".model.js"));

    console.log(colors.yellow(`Found ${modelFiles.length} model files`));

    // Import all models
    for (const file of modelFiles) {
      const modelPath = `../../models/${file}`;
      await import(modelPath);
      console.log(colors.green(`Loaded model from ${file}`));
    }
  } catch (error) {
    console.error(colors.red(`Error loading models: ${error.message}`));
    process.exit(1);
  }
};

// Dynamic data generators for models
const generateData = (modelName, count = 5) => {
  switch (modelName) {
    case "Branch":
      return Array.from({ length: count }).map(() => ({
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        tin: encryptTIN(faker.string.numeric(12)),
        machineId: faker.string.alphanumeric(10),
      }));

    // case "Location":
    //   return Array.from({ length: count }).map(() => ({
    //     name: faker.location.city(),
    //     address: faker.location.streetAddress(),
    //     contactPerson: faker.person.fullName(),
    //     contactNumber: faker.phone.number(),
    //   }));

    // case "User":
    //   return Array.from({ length: count }).map(() => ({
    //     name: faker.person.fullName(),
    //     email: faker.internet.email(),
    //     password: faker.internet.password({ length: 10 }),
    //     role: faker.helpers.arrayElement(["admin", "user", "manager"]),
    //   }));

    // case "GeneralJournal":
    //   return Array.from({ length: count }).map(() => {
    //     const date = faker.date.recent();
    //     return {
    //       date,
    //       month: date.getMonth() + 1,
    //       year: date.getFullYear().toString(),
    //       jvNo: `JV-${faker.string.numeric(6)}`,
    //       particular: faker.finance.transactionDescription(),
    //       transactionLines: JSON.stringify([
    //         {
    //           accountCode: faker.finance.accountNumber(),
    //           accountTitle: faker.finance.accountName(),
    //           debit: faker.number.float({
    //             min: 100,
    //             max: 10000,
    //             precision: 0.01,
    //           }),
    //           credit: 0,
    //         },
    //         {
    //           accountCode: faker.finance.accountNumber(),
    //           accountTitle: faker.finance.accountName(),
    //           debit: 0,
    //           credit: faker.number.float({
    //             min: 100,
    //             max: 10000,
    //             precision: 0.01,
    //           }),
    //         },
    //       ]),
    //     };
    //   });

    // Add more model generators here

    default:
      throw new Error(`No data generator found for model: ${modelName}`);
  }
};

const seedCollection = async (modelName, count, clearExisting = false) => {
  try {
    // Check if model exists
    // Get the model from our map
    const model = modelMap[modelName];

    if (!model) {
      console.error(
        colors.red(
          `Model "${modelName}" not found. Available models: ${Object.keys(
            modelMap
          ).join(", ")}`
        )
      );
      return false;
    }
    // if (!mongoose.modelNames().includes(modelName)) {
    //   console.error(
    //     colors.red(
    //       `Model "${modelName}" does not exist in Mongoose. Available models: ${mongoose
    //         .modelNames()
    //         .join(", ")}`
    //     )
    //   );
    //   return false;
    // }

    const Model = mongoose.model(modelName);

    // Clear existing records if requested
    if (clearExisting) {
      console.log(colors.yellow(`Clearing existing ${modelName} records...`));
      await Model.deleteMany({});
      console.log(colors.green(`Cleared ${modelName} collection`));
    }

    // Generate and insert data
    console.log(colors.yellow(`Generating ${count} ${modelName} records...`));
    const data = generateData(modelName, count);

    // Insert in batches for large datasets
    const batchSize = 100;
    const batches = Math.ceil(data.length / batchSize);

    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, data.length);
      const batch = data.slice(start, end);

      await Model.insertMany(batch);
      console.log(
        colors.green(
          `Inserted batch ${i + 1}/${batches} (${batch.length} records)`
        )
      );
    }

    console.log(
      colors.green.bold(
        `✓ Successfully seeded ${data.length} ${modelName} records`
      )
    );
    return true;
  } catch (err) {
    console.error(colors.red(`Error seeding ${modelName}: ${err.message}`));
    console.error(err);
    return false;
  }
};

const main = async () => {
  try {
    // Parse command line arguments
    const modelName = process.argv[2];
    const count = parseInt(process.argv[3]) || 5;
    const clearExisting = process.argv.includes("--clear");

    console.log(process.argv);

    if (!modelName) {
      console.log(colors.yellow("Please provide a model name."));
      console.log(
        colors.cyan(
          "Usage: node seed/dataSeeder.js <ModelName> [count] [--clear]"
        )
      );
      console.log(
        colors.cyan("Example: node seed/dataSeeder.js User 20 --clear")
      );
      process.exit(1);
    }

    // Connect to database
    const conn = await connectDB();

    // Load all models
    // await loadModels();

    console.log(colors.cyan(`Starting data seeding for ${modelName}...`));
    const success = await seedCollection(modelName, count, clearExisting);

    // Disconnect from database
    await mongoose.disconnect();
    console.log(colors.cyan("MongoDB connection closed"));

    // Exit with appropriate code
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error(colors.red(`Unhandled error: ${error.message}`));
    console.error(error);
    process.exit(1);
  }
};

/**
 * Data Seeder Usage Examples:
 * 
 * @example Basic usage - creates 5 Branch records (default)
 * node backend/seed/data/dataSeeder.js Branch
 * -- OR --
 * npm run seed:data Branch
 * 
 * @example Create 10 Branch records
 * node backend/seed/data/dataSeeder.js Branch 10
 * -- OR --
 * npm run seed:data Branch 10
 * 
 * @example Create 5 Branch records and clear existing data
 * NOTE: npm run seed:data is not working in this case 
 * node backend/seed/data/dataSeeder.js Branch 5 --clear
 * 
 */

// Run the seeder
main();