import fs from 'fs';
import { spawn } from 'child_process';

const MAX_CONCURRENCY = 10; // Limit the number of parallel processes
const data = fs.readFileSync('Mawkun.json', 'utf-8');
const jsonData = JSON.parse(data);
const posts = jsonData.posts;

let currentIndex = 0;
let runningProcesses = 0;

function startNextProcess() {
  if (currentIndex >= posts.length) return; // Stop when all records are processed

  const { link } = posts[currentIndex];
  const processIndex = currentIndex + 1;
  
  console.log(`Starting process for record ${processIndex}...`);
  
  const child = spawn('node', ['singlePageCrawlMawkun.js', link, processIndex.toString()], {
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
