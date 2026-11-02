import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';
import fs from 'fs';

let mongod = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      console.log('Connecting to external MongoDB Atlas...');
      await mongoose.connect(mongoUri);
      console.log(`MongoDB Atlas Connected: ${mongoose.connection.host}`);
    } else {
      console.log('No external MONGODB_URI found. Initializing local MongoDB engine...');
      
      // Ensure persistent data directory exists for embedded Mongo
      const dbPath = path.resolve(process.cwd(), 'data', 'db');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      mongod = await MongoMemoryServer.create({
        instance: {
          dbPath: dbPath,
          storageEngine: 'wiredTiger'
        }
      });

      const uri = mongod.getUri();
      await mongoose.connect(uri, { dbName: 'supplierquotecompare' });
      console.log(`Local Persistent MongoDB Connected: ${uri}`);
    }

    // Auto-seed initial suppliers if collection is empty
    await seedInitialData();

  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // If persistent memory server failed due to path lock, fallback to standard memory instance
    if (!mongoose.connection.readyState) {
      console.log('Starting standard in-memory fallback MongoDB instance...');
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri, { dbName: 'supplierquotecompare' });
      console.log(`Fallback MongoDB Connected: ${uri}`);
      await seedInitialData();
    }
  }
};

const seedInitialData = async () => {
  try {
    const Supplier = mongoose.model('Supplier');
    const count = await Supplier.countDocuments();
    if (count === 0) {
      console.log('Seeding initial baseline suppliers into MongoDB...');
      await Supplier.insertMany([
        {
          name: 'Apex Industrial Solutions',
          category: 'Machinery & Heavy Equipment',
          contactPerson: 'David Miller',
          email: 'd.miller@apexind.com',
          phone: '+1 (555) 234-5678',
          address: '4500 Industrial Parkway',
          city: 'Chicago',
          country: 'United States',
          rating: 4.8,
          activeQuotes: 4,
          paymentTerms: 'Net 30',
          status: 'Active',
          notes: 'Specialist in heavy hydraulics and actuator systems.'
        },
        {
          name: 'Global Tech Components',
          category: 'Electronics & Hardware',
          contactPerson: 'Elena Rostova',
          email: 'erostova@globaltech.io',
          phone: '+1 (555) 876-5432',
          address: '102 Silicon Boulevard',
          city: 'San Jose',
          country: 'United States',
          rating: 4.9,
          activeQuotes: 6,
          paymentTerms: 'Net 45',
          status: 'Active',
          notes: 'Tier-1 semiconductor distributor with RoHS compliance.'
        },
        {
          name: 'Vanguard Raw Materials Co.',
          category: 'Raw Materials & Metals',
          contactPerson: 'Marcus Chen',
          email: 'm.chen@vanguardmetals.com',
          phone: '+1 (555) 345-6789',
          address: '880 Harbor Logistics Way',
          city: 'Houston',
          country: 'United States',
          rating: 4.5,
          activeQuotes: 3,
          paymentTerms: 'Net 60',
          status: 'Active',
          notes: 'Supplies certified 6061-T6 aluminum alloys and structural steel.'
        },
        {
          name: 'Optima Packaging Corp.',
          category: 'Packaging & Logistics',
          contactPerson: 'Sarah Jenkins',
          email: 'sjenkins@optimapack.com',
          phone: '+1 (555) 987-1234',
          address: '320 Logistics Drive',
          city: 'Atlanta',
          country: 'United States',
          rating: 4.6,
          activeQuotes: 2,
          paymentTerms: 'Net 30',
          status: 'Active',
          notes: 'Sustainable packaging materials and custom industrial shipping cartons.'
        },
        {
          name: 'Sterling Chemical Works',
          category: 'Chemicals & Coatings',
          contactPerson: 'Dr. Arthur Pendelton',
          email: 'pendelton@sterlingchem.com',
          phone: '+1 (555) 456-7890',
          address: '12 Chemical Lane',
          city: 'Philadelphia',
          country: 'United States',
          rating: 4.2,
          activeQuotes: 1,
          paymentTerms: 'Net 15',
          status: 'Under Review',
          notes: 'Specialty coatings and corrosion inhibitor polymers.'
        },
        {
          name: 'Precision Dynamics Fab',
          category: 'Custom Fabrication & CNC',
          contactPerson: 'Rajiv Patel',
          email: 'r.patel@precisiondyn.com',
          phone: '+1 (555) 678-9012',
          address: '500 Auto Row Blvd',
          city: 'Detroit',
          country: 'United States',
          rating: 4.7,
          activeQuotes: 5,
          paymentTerms: 'Net 30',
          status: 'Active',
          notes: 'Multi-axis CNC milling, high tolerance aerospace and automotive parts.'
        }
      ]);
      console.log('Seeded 6 baseline suppliers successfully.');
    }

    // Seed baseline quotations if collection is empty
    const Quotation = mongoose.model('Quotation');
    const quoteCount = await Quotation.countDocuments();
    if (quoteCount === 0) {
      console.log('Seeding initial baseline quotations into MongoDB...');
      const allSuppliers = await Supplier.find();
      const apex = allSuppliers.find(s => s.name.includes('Apex')) || allSuppliers[0];
      const globalTech = allSuppliers.find(s => s.name.includes('Global')) || allSuppliers[1];
      const vanguard = allSuppliers.find(s => s.name.includes('Vanguard')) || allSuppliers[2];

      if (apex && globalTech) {
        await Quotation.create([
          {
            quotationNumber: 'QT-2026-001',
            supplierId: apex._id,
            supplierName: apex.name,
            quotationDate: new Date('2026-10-25'),
            validUntil: new Date('2026-12-15'),
            description: 'Hydraulic Actuators and Pressure Valve assembly for manufacturing line',
            status: 'Submitted',
            items: [
              {
                name: 'Hydraulic Actuators Series-X 500',
                description: 'Industrial heavy-duty dual-action actuator',
                category: 'Machinery',
                quantity: 50,
                packageSize: 1,
                measurementUnit: 'pcs',
                unitPrice: 28500,
                discountPercent: 5,
                discountAmount: 71250,
                taxPercent: 18,
                taxAmount: 243675,
                grossSubtotal: 1425000,
                netSubtotal: 1353750,
                lineTotal: 1597425,
                normalisedUnitPrice: 28500,
                normalisedBaseUnit: 'pcs'
              },
              {
                name: 'High Pressure Valve Seals Kit',
                description: 'Reinforced elastomer replacement seals (Pack of 10)',
                category: 'Machinery',
                quantity: 20,
                packageSize: 10,
                measurementUnit: 'pcs',
                unitPrice: 4200,
                discountPercent: 0,
                discountAmount: 0,
                taxPercent: 18,
                taxAmount: 15120,
                grossSubtotal: 84000,
                netSubtotal: 84000,
                lineTotal: 99120,
                normalisedUnitPrice: 420,
                normalisedBaseUnit: 'pcs'
              }
            ],
            commercialTerms: {
              deliveryCharges: 15000,
              additionalCharges: 5000,
              leadTimeDays: 14,
              warrantyMonths: 24,
              paymentTerms: 'Net 30',
              minOrderQuantity: 5,
              notes: 'Includes expedited air freight handling and 2-year manufacturer warranty replacement.'
            },
            summary: {
              grossSubtotal: 1509000,
              totalDiscount: 71250,
              netSubtotal: 1437750,
              totalTax: 258795,
              productSubtotal: 1696545,
              deliveryCharges: 15000,
              additionalCharges: 5000,
              grandTotal: 1716545,
              currency: 'INR'
            }
          },
          {
            quotationNumber: 'QT-2026-002',
            supplierId: globalTech._id,
            supplierName: globalTech.name,
            quotationDate: new Date('2026-10-28'),
            validUntil: new Date('2026-11-30'),
            description: 'ARM Cortex M7 Microcontroller & Fiber Transceivers',
            status: 'Accepted',
            items: [
              {
                name: 'ARM Cortex M7 Microcontroller Boards',
                description: 'Industrial IoT embedded controller boards',
                category: 'Electronics',
                quantity: 1200,
                packageSize: 1,
                measurementUnit: 'pcs',
                unitPrice: 1550,
                discountPercent: 8,
                discountAmount: 148800,
                taxPercent: 18,
                taxAmount: 308016,
                grossSubtotal: 1860000,
                netSubtotal: 1711200,
                lineTotal: 2019216,
                normalisedUnitPrice: 1550,
                normalisedBaseUnit: 'pcs'
              }
            ],
            commercialTerms: {
              deliveryCharges: 8500,
              additionalCharges: 2500,
              leadTimeDays: 7,
              warrantyMonths: 12,
              paymentTerms: 'Net 45',
              minOrderQuantity: 100,
              notes: 'Volume discount of 8% applied for orders above 1,000 units. RoHS compliant.'
            },
            summary: {
              grossSubtotal: 1860000,
              totalDiscount: 148800,
              netSubtotal: 1711200,
              totalTax: 308016,
              productSubtotal: 2019216,
              deliveryCharges: 8500,
              additionalCharges: 2500,
              grandTotal: 2030216,
              currency: 'INR'
            }
          }
        ]);
        console.log('Seeded 2 baseline quotations successfully.');
      }
    }
  } catch (err) {
    console.error('Error during data seeding:', err.message);
  }
};

