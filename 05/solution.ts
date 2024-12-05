// --- Day 5: Page Ordering ---
import * as fs from 'fs';

interface Rule {
    before: number;
    after: number;
}

interface Update {
    pages: number[];
}

function parseRule(line: string): Rule {
    const [before, after] = line.split('|').map(Number);
    return { before, after };
}

function parseUpdate(line: string): Update {
    return { pages: line.split(',').map(Number) };
}

function isInOrder(update: Update, rules: Rule[]): boolean {
    for (const rule of rules) {
        const beforeIndex = update.pages.indexOf(rule.before);
        const afterIndex = update.pages.indexOf(rule.after);
        
        // If both numbers exist in the update
        if (beforeIndex !== -1 && afterIndex !== -1) {
            // Check if they're in the wrong order
            if (beforeIndex > afterIndex) {
                return false;
            }
        }
    }
    return true;
}

function findEmptyLineIndex(lines: string[]): number {
    return lines.findIndex(line => line.trim() === '');
}

function solvePart1(input: string[]): number {
    const emptyLineIndex = findEmptyLineIndex(input);
    const rules = input.slice(0, emptyLineIndex).map(parseRule);
    const updates = input.slice(emptyLineIndex + 1).map(parseUpdate);
    
    const correctlyOrdered = updates.filter(update => isInOrder(update, rules));
    
    // Sum up the middle numbers of correctly ordered updates
    return correctlyOrdered.reduce((sum, update) => {
        const middleIndex = Math.floor(update.pages.length / 2);
        return sum + update.pages[middleIndex];
    }, 0);
}

function topologicalSort(pages: number[], rules: Rule[]): number[] {
    // Create adjacency list
    const graph = new Map<number, Set<number>>();
    pages.forEach(page => graph.set(page, new Set()));
    
    // Build the graph based on rules
    for (const rule of rules) {
        if (pages.includes(rule.before) && pages.includes(rule.after)) {
            const set = graph.get(rule.before) || new Set();
            set.add(rule.after);
            graph.set(rule.before, set);
        }
    }
    
    // Calculate in-degrees
    const inDegree = new Map<number, number>();
    pages.forEach(page => inDegree.set(page, 0));
    for (const [_, neighbors] of graph) {
        for (const neighbor of neighbors) {
            inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
        }
    }
    
    // Find nodes with no incoming edges
    const queue: number[] = [];
    for (const [page, degree] of inDegree) {
        if (degree === 0) queue.push(page);
    }
    
    // Process the queue
    const result: number[] = [];
    while (queue.length > 0) {
        const current = queue.shift()!;
        result.push(current);
        
        const neighbors = graph.get(current) || new Set();
        for (const neighbor of neighbors) {
            inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
            if (inDegree.get(neighbor) === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    return result;
}

function solvePart2(input: string[]): number {
    const emptyLineIndex = findEmptyLineIndex(input);
    const rules = input.slice(0, emptyLineIndex).map(parseRule);
    const updates = input.slice(emptyLineIndex + 1).map(parseUpdate);
    
    // Find incorrectly ordered updates
    const incorrectUpdates = updates.filter(update => !isInOrder(update, rules));
    
    // Sort each incorrect update and get their middle numbers
    const middleNumbers = incorrectUpdates.map(update => {
        const sortedPages = topologicalSort(update.pages, rules);
        const middleIndex = Math.floor(sortedPages.length / 2);
        return sortedPages[middleIndex];
    });
    
    // Sum up the middle numbers
    return middleNumbers.reduce((sum, num) => sum + num, 0);
}

// Read input file
const input = fs.readFileSync('test-data.txt', 'utf8');
const lines = input.trim().split('\n');

// Solve part 1
const result1 = solvePart1(lines);
console.log(`Part 1: Sum of middle numbers from correctly ordered updates: ${result1}`);

// Solve part 2
const result2 = solvePart2(lines);
console.log(`Part 2: Sum of middle numbers from reordered updates: ${result2}`);