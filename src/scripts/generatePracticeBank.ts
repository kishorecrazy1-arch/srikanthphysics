/**
 * Script to generate practice bank questions for all topics/subtopics
 * Run this to populate the practice bank
 * 
 * Usage: Import and call generateAllPracticeBanks()
 */

import { PracticeBankGenerator } from '../services/practiceBankGenerator';

async function main() {
  console.log('🚀 Starting Practice Bank Generation...');
  console.log('This will generate 5 questions for each topic/subtopic/difficulty combination');
  console.log('This may take several minutes...\n');

  const generator = new PracticeBankGenerator();
  await generator.generateAllPracticeBanks();

  console.log('\n✅ Practice Bank Generation Complete!');
  console.log('You can now use Practice Mode to access these questions.');
}

// Run if called directly
if (import.meta.hot) {
  // In development, you can call this manually
  console.log('Practice Bank Generator loaded. Call generateAllPracticeBanks() to start.');
}

export { main as generatePracticeBank };

