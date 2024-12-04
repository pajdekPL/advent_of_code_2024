// --- Day 4: Ceres Search ---
// "Looks like the Chief's not here. Next!" One of The Historians pulls out a device and pushes the only button on it. After a brief flash, you recognize the interior of the Ceres monitoring station!

// As the search for the Chief continues, a small Elf who lives on the station tugs on your shirt; she'd like to know if you could help her with her word search (your puzzle input). She only has to find one word: XMAS.

// This word search allows words to be horizontal, vertical, diagonal, written backwards, or even overlapping other words. It's a little unusual, though, as you don't merely need to find one instance of XMAS - you need to find all of them. Here are a few ways XMAS might appear, where irrelevant characters have been replaced with .:


// ..X...
// .SAMX.
// .A..A.
// XMAS.S
// .X....
// The actual word search will be full of letters instead. For example:

// MMMSXXMASM
// MSAMXMSMSA
// AMXSXMAAMM
// MSAMASMSMX
// XMASAMXAMM
// XXAMMXXAMA
// SMSMSASXSS
// SAXAMASAAA
// MAMMMXMMMM
// MXMXAXMASX
// In this word search, XMAS occurs a total of 18 times; here's the same word search again, but where letters not involved in any XMAS have been replaced with .:

// ....XXMAS.
// .SAMXMS...
// ...S..A...
// ..A.A.MS.X
// XMASAMX.MM
// X.....XA.A
// S.S.S.S.SS
// .A.A.A.A.A
// ..M.M.M.MM
// .X.X.XMASX
// Take a look at the little Elf's word search. How many times does XMAS appear?

import * as fs from 'fs';

// Read input file
const input = fs.readFileSync('test-data.txt', 'utf8');
const grid = input.trim().split('\n');

// All possible directions to search (horizontal, vertical, diagonal)
const directions = [
    [0, 1],   // right
    [1, 0],   // down
    [1, 1],   // diagonal down-right
    [-1, 1],  // diagonal up-right
    [0, -1],  // left
    [-1, 0],  // up
    [-1, -1], // diagonal up-left
    [1, -1]   // diagonal down-left
];

function findXMAS(grid: string[]): number {
    let count = 0;
    const rows = grid.length;
    const cols = grid[0].length;
    const target = 'XMAS';

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Try each direction from current position
            for (const [dx, dy] of directions) {
                let found = true;
                for (let i = 0; i < target.length; i++) {
                    const newRow = row + i * dx;
                    const newCol = col + i * dy;
                    
                    // Check if position is within grid bounds
                    if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
                        found = false;
                        break;
                    }
                    
                    // Check if character matches
                    if (grid[newRow][newCol] !== target[i]) {
                        found = false;
                        break;
                    }
                }
                if (found) {
                    count++;
                }
            }
        }
    }
    return count;
}

// Solve part 1
const result = findXMAS(grid);
console.log(`Part 1: Found ${result} occurrences of XMAS`);



// --- Part Two ---
// The Elf looks quizzically at you. Did you misunderstand the assignment?

// Looking for the instructions, you flip over the word search to find that this isn't actually an XMAS puzzle; it's an X-MAS puzzle in which you're supposed to find two MAS in the shape of an X. One way to achieve that is like this:

// M.S
// .A.
// M.S
// Irrelevant characters have again been replaced with . in the above diagram. Within the X, each MAS can be written forwards or backwards.

// Here's the same example from before, but this time all of the X-MASes have been kept instead:

// .M.S......
// ..A..MSMS.
// .M.S.MAA..
// ..A.ASMSM.
// .M.S.M....
// ..........
// S.S.S.S.S.
// .A.A.A.A..
// M.M.M.M.M.
// ..........
// In this example, an X-MAS appears 9 times.

// Flip the word search from the instructions back over to the word search side and try again. How many times does an X-MAS appear?

function findXMAS_Part2(grid: string[]): number {
    let count = 0;
    const rows = grid.length;
    const cols = grid[0].length;
    const target = 'MAS';

    // Check each possible center point of the X
    for (let row = 1; row < rows - 1; row++) {
        for (let col = 1; col < cols - 1; col++) {
            // The center point must be 'A'
            if (grid[row][col] !== 'A') continue;

            // Get the diagonal strings (from top-left to bottom-right and top-right to bottom-left)
            const diagonal1 = grid[row-1][col-1] + grid[row][col] + grid[row+1][col+1];
            const diagonal2 = grid[row-1][col+1] + grid[row][col] + grid[row+1][col-1];

            // Check if both diagonals are valid MAS patterns (forward or backward)
            const isValidMAS = (str: string) => str === target || str === target.split('').reverse().join('');
            
            if (isValidMAS(diagonal1) && isValidMAS(diagonal2)) {
                count++;
            }
        }
    }
    return count;
}

// Solve part 2
const result2 = findXMAS_Part2(grid);
console.log(`Part 2: Found ${result2} X-MAS patterns`);
