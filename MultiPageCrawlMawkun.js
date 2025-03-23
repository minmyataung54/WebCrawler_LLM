import fs from 'fs';
import { spawn } from 'child_process';

const MAX_CONCURRENCY = 10; // Limit the number of parallel processes
const data = fs.readFileSync('Mawkun.json', 'utf-8');
const jsonData = JSON.parse(data);
const posts = jsonData.posts;

let previousDate = null;
let sameDateCount = 0;
let currentIndex = 0;
let runningProcesses = 0;

function startNextProcess() {
  if (currentIndex >= posts.length) return; // Stop when all records are processed

  const { title , link , date } = posts[currentIndex];
  if (previousDate && previousDate === date) {
    // Skip if the date is the same as the previous record
    sameDateCount++;
  }else{
    previousDate = date;
    sameDateCount = 0;
  }
  const processIndex = currentIndex + 1;
  
  console.log(`Starting process for record ${processIndex}...`);
  
  const child = spawn('node', ['singlePageCrawlMawkun.js', link, sameDateCount.toString() , date , title], {
    stdio: 'inherit', // Inherits stdout and stderr for live logs
  });

  runningProcesses++;
  currentIndex++;

  child.on('exit', (code) => {
    console.log(`Process ${processIndex} exited with code ${code}`);
    runningProcesses--;

    // Start the next process when one finishes
    startNextProcess();
  });
}

// Start the initial batch of processes
for (let i = 0; i < Math.min(MAX_CONCURRENCY, posts.length); i++) {
  startNextProcess();
}
