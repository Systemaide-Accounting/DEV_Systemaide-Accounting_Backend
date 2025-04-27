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
import AgentInfo from "../../models/agentInfo.model.js";
import ChartOfAccount from "../../models/chartOfAccount.model.js";
import CashDisbursementTransaction from "../../models/cashDisbursementTransaction.model.js";
import CashReceiptsTransaction from "../../models/cashReceiptsTransaction.model.js";
import PurchaseOnAccountTransaction from "../../models/purchaseOnAccountTransaction.model.js";
import SalesOnAccount from "../../models/salesOnAccount.model.js";

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
  "AgentInfo": AgentInfo,
  "ChartOfAccount": ChartOfAccount,
  "CashDisbursementTransaction": CashDisbursementTransaction,
  "CashReceiptsTransaction": CashReceiptsTransaction,
  "GeneralJournal": GeneralJournal,
  "PurchaseOnAccountTransaction": PurchaseOnAccountTransaction,
  "SalesOnAccount": SalesOnAccount,
};

// Dynamic data generators for models
const generateData = async (modelName, count = 5) => {
  
  // Fetch Branch IDs from the database
  const branchIds = await mongoose.model("Branch").find({}, "_id").lean();
  // Fetch Location IDs from the database
  const locationIds = await mongoose.model("Location").find({}, "_id").lean();
  // Fetch AgentInfo IDs from the database
  const agentIds = await mongoose.model("AgentInfo").find({}, "_id").lean();
  // Fetch ChartOfAccount IDs from the database
  const chartOfAccountIds = await mongoose
    .model("ChartOfAccount")
    .find({}, "_id")
    .lean();

  switch (modelName) {
    case "Branch":
      return Array.from({ length: count }).map(() => ({
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        tin: encryptTIN(faker.string.numeric(12)),
        machineId: faker.string.alphanumeric(10),
      }));

    case "Location":
      if (branchIds?.length === 0) {
        console.warn(
          colors.yellow(
            "No Branch records found. Please seed Branch data first."
          )
        );
        console.warn(colors.yellow("Run: npm run seed:data Branch"));
        throw new Error("Location records require Branch references");
      }

      return Array.from({ length: count }).map(() => ({
        name: faker.location.city(),
        address: faker.location.streetAddress(),
        tin: encryptTIN(faker.string.numeric(12)),
        machineId: faker.string.alphanumeric(10),
        branch: faker.helpers.arrayElement(branchIds)._id,
      }));

    case "AgentInfo":
      return Array.from({ length: count }).map(() => ({
        agentCode: faker.string.numeric(10),
        tin: encryptTIN(faker.string.numeric(12)),
        taxClassification: faker.helpers.arrayElement([
          "individual",
          "non-individual",
        ]),
        registeredName: faker.company.name(),
        agentName: faker.person.fullName(),
        tradeName: faker.company.name(),
        agentType: faker.helpers.arrayElement([
          "customer",
          "supplier",
          "government-agency",
          "employee",
          "others",
        ]),
        registrationType: faker.helpers.arrayElement(["vat", "non-vat"]),
        authorizedRepresentative: faker.person.fullName(),
        agentAddress: faker.location.streetAddress(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        fax: faker.string.numeric(5),
        website: faker.internet.url(),
      }));

    case "ChartOfAccount":
      return Array.from({ length: count }).map(() => ({
        accountCode: faker.string.numeric(10),
        accountName: faker.finance.accountName(),
        accountType: faker.helpers.arrayElement([
          "",
          "asset",
          "liability",
          "equity",
          "revenue",
          "expense",
        ]),
        normalBalance: faker.helpers.arrayElement(["", "debit", "credit"]),
      }));

    case "CashDisbursementTransaction":
      if (
        locationIds?.length === 0 ||
        agentIds?.length === 0 ||
        chartOfAccountIds?.length === 0
      ) {
        console.warn(
          colors.yellow(
            "No Location, AgentInfo, OR ChartOfAccount records found. Please seed these data first."
          )
        );
        console.warn(colors.yellow("Run: npm run seed:data Location"));
        console.warn(colors.yellow("Run: npm run seed:data AgentInfo"));
        console.warn(colors.yellow("Run: npm run seed:data ChartOfAccount"));
        throw new Error(
          "CashDisbursementTransaction records require Location, AgentInfo, and ChartOfAccount references"
        );
      }

      return Array.from({ length: count }).map(() => {
        // Generate a random date
        const date = faker.date.recent();

        return {
          date,
          // get name of the month from date
          month: date.toLocaleString("default", { month: "long" }),
          // Convert the current year to a string
          year: date.getFullYear().toString(),
          location: faker.helpers.arrayElement(locationIds)._id,
          cvNo: `CV-${faker.string.numeric(6)}`,
          checkNo: `${faker.string.numeric(6)}`,
          payeeName: faker.helpers.arrayElement(agentIds)._id,
          address: faker.location.streetAddress(),
          tin: encryptTIN(faker.string.numeric(12)),
          cashAccount: faker.helpers.arrayElement(chartOfAccountIds)._id,
          particular: faker.finance.transactionDescription(),
        };
      });

    case "CashReceiptsTransaction":
      if (
        locationIds?.length === 0 ||
        chartOfAccountIds?.length === 0
      ) {
        console.warn(
          colors.yellow(
            "No Location OR ChartOfAccount records found. Please seed these data first."
          )
        );
        console.warn(colors.yellow("Run: npm run seed:data Location"));
        console.warn(colors.yellow("Run: npm run seed:data ChartOfAccount"));
        throw new Error(
          "CashDisbursementTransaction records require Location and ChartOfAccount references"
        );
      }

      return Array.from({ length: count }).map(() => {
        // Generate a random date
        const date = faker.date.recent();
        return {
          date,
          // get name of the month from date
          month: date.toLocaleString("default", { month: "long" }),
          year: date.getFullYear().toString(),
          location: faker.helpers.arrayElement(locationIds)._id,
          orNo: `OR-${faker.string.numeric(6)}`,
          payorName: faker.person.fullName(),
          address: faker.location.streetAddress(),
          tin: encryptTIN(faker.string.numeric(12)),
          cashAccount: faker.helpers.arrayElement(chartOfAccountIds)._id,
          cashAmount: Number(
            faker.number
              .float({
                min: 10,
                max: 10000,
                precision: 0.01,
              })
              .toFixed(2)
          ),
          particular: faker.finance.transactionDescription(),
        };
      });

    case "GeneralJournal":
      if (locationIds?.length === 0) {
        console.warn(colors.yellow("No Location records found. Please seed Location data first."));
        console.warn(colors.yellow("Run: npm run seed:data Location"));
        throw new Error("GeneralJournal records require Location references");
      }

      return Array.from({ length: count }).map(() => {
        const date = faker.date.recent();
        return {
          date,
          month: date.toLocaleString("default", { month: "long" }),
          year: date.getFullYear().toString(),
          location: faker.helpers.arrayElement(locationIds)._id,
          jvNo: `JV-${faker.string.numeric(6)}`,
          particular: faker.finance.transactionDescription(),
        };
      });

    case "PurchaseOnAccountTransaction":
      if (locationIds?.length === 0 || agentIds?.length === 0) {
        console.warn(
          colors.yellow(
            "No Location OR AgentInfo records found. Please seed these data first."
          )
        );
        console.warn(colors.yellow("Run: npm run seed:data Location"));
        console.warn(colors.yellow("Run: npm run seed:data AgentInfo"));
        throw new Error(
          "PurchaseOnAccountTransaction records require Location and AgentInfo references"
        );
      }

      return Array.from({ length: count }).map(() => {
        const date = faker.date.recent();
        return {
          date,
          month: date.toLocaleString("default", { month: "long" }),
          year: date.getFullYear().toString(),
          location: faker.helpers.arrayElement(locationIds)._id,
          pvNo: `PV-${faker.string.numeric(6)}`,
          invoiceNo: `INV-${faker.string.numeric(6)}`,
          supplierName: faker.helpers.arrayElement(agentIds)._id,
          address: faker.location.streetAddress(),
          tin: encryptTIN(faker.string.numeric(12)),
          particular: faker.finance.transactionDescription(),
        };
      });

    case "SalesOnAccount":
      if (locationIds?.length === 0) {
        console.warn(colors.yellow("No Location records found. Please seed Location data first."));
        console.warn(colors.yellow("Run: npm run seed:data Location"));
        throw new Error("SalesOnAccount records require Location references");
      }

      return Array.from({ length: count }).map(() => {
        const date = faker.date.recent();
        return {
          date,
          month: date.toLocaleString("default", { month: "long" }),
          year: date.getFullYear().toString(),
          location: faker.helpers.arrayElement(locationIds)._id,
          invoiceNo: `INV-${faker.string.numeric(6)}`,
          customerName: faker.person.fullName(),
          address: faker.location.streetAddress(),
          tin: encryptTIN(faker.string.numeric(12)),
          particular: faker.finance.transactionDescription(),
        };
      });

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

    const Model = mongoose.model(modelName);

    // Clear existing records if requested
    if (clearExisting) {
      console.log(colors.yellow(`Clearing existing ${modelName} records...`));
      await Model.deleteMany({});
      console.log(colors.green(`Cleared ${modelName} collection`));
    }

    // Generate and insert data
    console.log(colors.yellow(`Generating ${count} ${modelName} records...`));
    const data = await generateData(modelName, count);

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
    const modelName = process.argv[3];
    const count = parseInt(process.argv[4]) || 5;
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
 * 
 * @example Create 10 Branch records
 * node backend/seed/data/dataSeeder.js Branch 10
 * 
 * @example Create 5 Branch records and clear existing data
 * NOTE: npm run seed:data is not working in this case 
 * npm run seed:data Branch 5
 * 
 */

// Run the seeder
main();