import React, { useState, useEffect, useContext } from "react";
import { Wallet, TrendingUp, Award, MoreVertical, Shield, Instagram,
  Lock,Package, Tag, Coins, Trophy, Settings, CheckCircle, AlertTriangle,
  MessageSquare, Search, User, ChevronDown, ChevronUp, ChevronRight, Check,
  LogOut, Copy, X, Menu, Plus, Edit, Trash2, Upload, XCircle,
  Star} from 'lucide-react';
// Mock Firebase auth functions
const mockAuth = {
  createUserWithEmailAndPassword: async (auth, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === "test@error.com") throw new Error("Email already in use");
    return { user: { email } };
  },
  signInWithEmailAndPassword: async (auth, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (password === "wrong") throw new Error("Invalid password");
    return { user: { email } };
  }
};

const mockFirebaseAuth = {};

// Cart Context for the new header
const CartContext = React.createContext({
  cartItems: [],
  wishlistItems: []
});

 // Binary Tree Node class
class TreeNode {
constructor(id, name, email, userType, level = 0) {
this.id = id;
this.name = name;
this.email = email;
this.userType = userType;
this.level = level;
this.left = null;
this.right = null;
this.parent = null;
this.directReferrals = []; // IDs of ALL direct children (not just left/right)
this.directParentId = null; // Who referred this user
this.directIncome = 0;
this.indirectIncome = 0;
this.totalSales = 0;
this.leftSubtreeSales = 0;
this.rightSubtreeSales = 0;
this.carryForwardLeft = 0;
this.carryForwardRight = 0;
this.height = 1;
this.brandName = "";
// New properties for dashboard
this.kycVerified = false;
this.kycData = null;
this.bankAccount = null;
this.mobile = "";
this.joinDate = new Date().toISOString().split('T')[0];
this.products = [];
// New properties for credit wallet system
this.creditWallet = 0;
this.creditHistory = [];
this.franchiseATurnover = 0; // Track turnover from direct children in left side
this.franchiseBTurnover = 0; // Track turnover from direct children in right side
// Initialize eWallet to 0
this.eWallet = 0;
// Track original logical parent for customers moved due to brand owner insertion
this.logicalParentId = null;
}
}

// MLM Tree Manager
class MLMTreeManager {
constructor() {
this.allNodes = new Map();
this.usersByEmail = new Map();
this.root = null;
this.initializeFounders();
}

initializeFounders() {
// Level 0 - Root Founder
const founder0 = new TreeNode("FOUND001", "Founder Alpha", "founder1@engineers.com", "founder", 0);

// Level 1 - Two Founders
const founder1 = new TreeNode("FOUND002", "Founder Beta", "founder2@engineers.com", "founder", 1);
const founder2 = new TreeNode("FOUND003", "Founder Gamma", "founder3@engineers.com", "founder", 1);

// Set up tree structure
founder0.left = founder1;
founder0.right = founder2;
founder1.parent = founder0;
founder2.parent = founder0;

// Set direct parent relationships
founder1.directParentId = "FOUND001";
founder2.directParentId = "FOUND001";
founder0.directReferrals = ["FOUND002", "FOUND003"];

this.root = founder0;

// Add to maps
this.allNodes.set("FOUND001", founder0);
this.allNodes.set("FOUND002", founder1);
this.allNodes.set("FOUND003", founder2);

this.usersByEmail.set("founder1@engineers.com", founder0);
this.usersByEmail.set("founder2@engineers.com", founder1);
this.usersByEmail.set("founder3@engineers.com", founder2);
}

// Find next available position in a subtree using BFS
findNextPositionInSubtree(subtreeRoot) {
const queue = [subtreeRoot];

while (queue.length > 0) {
const current = queue.shift();

if (!current.left) {
return { node: current, position: 'left' };
}
if (!current.right) {
return { node: current, position: 'right' };
}

if (current.left) queue.push(current.left);
if (current.right) queue.push(current.right);
}

return null;
}

// Find next available position for CUSTOMER using BFS (entire tree)
getNextCustomerParentInfo() {
const queue = [this.root];

while (queue.length > 0) {
const current = queue.shift();

if (!current.left) {
return { parentId: current.id, parentName: current.name, position: 'left' };
}
if (!current.right) {
return { parentId: current.id, parentName: current.name, position: 'right' };
}

if (current.left) queue.push(current.left);
if (current.right) queue.push(current.right);
}

return null;
}

// Find next available position for BRAND OWNER (only under founders and brand owners)
getNextBrandOwnerParentInfo() {
const queue = [this.root];

while (queue.length > 0) {
const current = queue.shift();

// Only place brand owners under founders or other brand owners
if (current.userType === 'founder' || current.userType === 'brand_owner') {
if (!current.left) {
return {
parentId: current.id,
parentName: current.name,
position: 'left',
replacingCustomer: null
};
}

if (current.left && current.left.userType === 'customer') {
return {
parentId: current.id,
parentName: current.name,
position: 'left',
replacingCustomer: current.left
};
}

if (!current.right) {
return {
parentId: current.id,
parentName: current.name,
position: 'right',
replacingCustomer: null
};
}

if (current.right && current.right.userType === 'customer') {
return {
parentId: current.id,
parentName: current.name,
position: 'right',
replacingCustomer: current.right
};
}
}

if (current.left) queue.push(current.left);
if (current.right) queue.push(current.right);
}

return null;
}

generateNextUserId(userType) {
let prefix = 'CUST';
if (userType === 'brand_owner') prefix = 'BRAND';
if (userType === 'founder') prefix = 'FOUND';

const userIds = Array.from(this.allNodes.keys())
.filter(id => id.startsWith(prefix))
.map(id => {
const numPart = id.replace(prefix, '');
return parseInt(numPart) || 0;
})
.sort((a, b) => b - a);

const nextNumber = userIds.length > 0 ? userIds[0] + 1 : 1;
return `${prefix}${String(nextNumber).padStart(3, '0')}`;
}

registerCustomer(name, email, password, contact, dateOfBirth, manualParentId = null) {
let directParent = null;
let placementParent = null;
let position = null;

if (manualParentId) {
directParent = this.allNodes.get(manualParentId);
if (!directParent) {
return { success: false, error: "Invalid parent ID" };
}

// Always use BFS to find the next available position in the parent's subtree
const positionInfo = this.findNextPositionInSubtree(directParent);

if (!positionInfo) {
return { success: false, error: "No available position in parent's subtree" };
}

placementParent = positionInfo.node;
position = positionInfo.position;
} else {
// Global BFS for customers without referrals
const parentInfo = this.getNextCustomerParentInfo();

if (!parentInfo) {
return { success: false, error: "No available position in tree" };
}

placementParent = this.allNodes.get(parentInfo.parentId);
directParent = placementParent;
position = parentInfo.position;

if (!placementParent) {
return { success: false, error: "Parent node not found" };
}
}

const newUserId = this.generateNextUserId('customer');
const newUser = new TreeNode(newUserId, name, email, 'customer', placementParent.level + 1);
newUser.directParentId = directParent.id;
newUser.mobile = contact;

// Place in tree structure
if (position === 'left') {
placementParent.left = newUser;
} else {
placementParent.right = newUser;
}
newUser.parent = placementParent;

// Give direct income to the DIRECT parent (who referred them)
const purchaseAmount = 1000;
const directIncome = purchaseAmount * 0.05;
directParent.directIncome += directIncome;
directParent.totalSales += purchaseAmount;
directParent.directReferrals.push(newUserId);

// Update franchise turnover for the direct parent
if (position === 'left') {
directParent.franchiseATurnover += purchaseAmount;
} else {
directParent.franchiseBTurnover += purchaseAmount;
}

this.allNodes.set(newUserId, newUser);
this.usersByEmail.set(email, newUser);

return {
success: true,
userId: newUserId,
directParentId: directParent.id,
directParentName: directParent.name,
placementParentId: placementParent.id,
placementParentName: placementParent.name,
level: newUser.level,
position: position,
isThirdPlusChild: directParent.id !== placementParent.id
};
}

registerBrandOwner(name, email, password, contact, brandName, businessRegNo, gstNo) {
const parentInfo = this.getNextBrandOwnerParentInfo();

if (!parentInfo) {
return { success: false, error: "No available position for brand owner" };
}

const parent = this.allNodes.get(parentInfo.parentId);
if (!parent) {
return { success: false, error: "Parent node not found" };
}

const newUserId = this.generateNextUserId('brand_owner');
const newUser = new TreeNode(newUserId, name, email, 'brand_owner', parent.level + 1);
newUser.brandName = brandName;
newUser.directParentId = parent.id;
newUser.mobile = contact;

const replacedCustomer = parentInfo.replacingCustomer;
let movedCustomerInfo = null;

if (parentInfo.position === 'left') {
parent.left = newUser;
} else {
parent.right = newUser;
}
newUser.parent = parent;

if (replacedCustomer) {
// Remove customer from parent's direct referrals
const index = parent.directReferrals.indexOf(replacedCustomer.id);
if (index > -1) {
parent.directReferrals.splice(index, 1);
}

// Place customer as left child of the new brand owner
newUser.left = replacedCustomer;
replacedCustomer.parent = newUser;
replacedCustomer.level = newUser.level + 1;

// Set logical parent to maintain income flow
replacedCustomer.logicalParentId = parent.id;

// Add customer to brand owner's direct referrals
newUser.directReferrals.push(replacedCustomer.id);
replacedCustomer.directParentId = newUser.id;

movedCustomerInfo = {
customerId: replacedCustomer.id,
customerName: replacedCustomer.name,
newPosition: 'left',
logicalParentId: parent.id,
logicalParentName: parent.name
};
}

const purchaseAmount = 5000;
const directIncome = purchaseAmount * 0.05;
parent.directIncome += directIncome;
parent.totalSales += purchaseAmount;
parent.directReferrals.push(newUserId);

// Update franchise turnover for the parent
if (parentInfo.position === 'left') {
parent.franchiseATurnover += purchaseAmount;
} else {
parent.franchiseBTurnover += purchaseAmount;
}

this.allNodes.set(newUserId, newUser);
this.usersByEmail.set(email, newUser);

return {
success: true,
userId: newUserId,
brandName: brandName,
parentId: parent.id,
parentName: parent.name,
level: newUser.level,
position: parentInfo.position,
replacedCustomer: movedCustomerInfo
};
}

/**
* A robust method to swap two nodes in the binary tree.
* This correctly handles all cases, including swapping a parent with its child,
* and ensures no nodes are lost from the tree structure.
* @param {TreeNode} nodeA - The first node to swap.
* @param {TreeNode} nodeB - The second node to swap.
*/
swapNodes(nodeA, nodeB) {
if (nodeA === nodeB) return;

const parentA = nodeA.parent;
const parentB = nodeB.parent;

const posA = parentA ? (parentA.left === nodeA ? 'left' : 'right') : null;
const posB = parentB ? (parentB.left === nodeB ? 'left' : 'right') : null;

// Store original children
const leftA = nodeA.left;
const rightA = nodeA.right;
const leftB = nodeB.left;
const rightB = nodeB.right;

// 1. Detach nodes from their old parents
if (parentA) parentA[posA] = null;
if (parentB) parentB[posB] = null;

// 2. Re-attach nodes to their new parents
if (parentA) parentA[posA] = nodeB;
if (parentB) parentB[posB] = nodeA;

// 3. Swap children pointers, ensuring a node doesn't become its own child
nodeA.left = (leftB === nodeA) ? nodeB : leftB;
nodeA.right = (rightB === nodeA) ? nodeB : rightB;
nodeB.left = (leftA === nodeB) ? nodeA : leftA;
nodeB.right = (rightA === nodeB) ? nodeA : rightA;

// 4. Update parent pointers of all children
if (nodeA.left) nodeA.left.parent = nodeA;
if (nodeA.right) nodeA.right.parent = nodeA;
if (nodeB.left) nodeB.left.parent = nodeB;
if (nodeB.right) nodeB.right.parent = nodeB;

// 5. Swap parent pointers
nodeA.parent = parentB;
nodeB.parent = parentA;

// 6. Swap levels
const levelA = nodeA.level;
nodeA.level = nodeB.level;
nodeB.level = levelA;

// 7. Update root if necessary
if (this.root === nodeA) {
this.root = nodeB;
} else if (this.root === nodeB) {
this.root = nodeA;
}

// 8. Update levels for all nodes in the swapped subtrees
const updateSubtreeLevels = (node) => {
if (!node) return;
const queue = [node];
while (queue.length > 0) {
const current = queue.shift();
if (current.left) {
current.left.level = current.level + 1;
queue.push(current.left);
}
if (current.right) {
current.right.level = current.level + 1;
queue.push(current.right);
}
}
};
updateSubtreeLevels(nodeA);
updateSubtreeLevels(nodeB);
}

/**
* Restructures the tree based on income, but only for customers.
* @returns {Array} An array of objects detailing the swaps that occurred.
*/
restructureTreeBasedOnIncome() {
const performedSwaps = [];
const maxIterations = this.allNodes.size * 2; // Safeguard
let iterations = 0;
let swapHappened = true;

while (swapHappened && iterations < maxIterations) {
iterations++;
swapHappened = false;
const nodesByLevel = Array.from(this.allNodes.values()).sort((a, b) => b.level - a.level);

for (const node of nodesByLevel) {
// Only consider swaps if both the node and its parent are 'customers'
if (node === this.root || !node.parent || node.userType !== 'customer' || node.parent.userType !== 'customer') {
continue;
}

const totalIncome = node.directIncome + node.indirectIncome;
const parentTotalIncome = node.parent.directIncome + node.parent.indirectIncome;

if (totalIncome > parentTotalIncome) {
performedSwaps.push({
childId: node.id,
childName: node.name,
childIncome: totalIncome,
parentId: node.parent.id,
parentName: node.parent.name,
parentIncome: parentTotalIncome
});

this.swapNodes(node, node.parent);
swapHappened = true;
break; // Restart the check from the bottom
}
}
}

if (iterations >= maxIterations) {
console.error("Tree restructuring stopped due to exceeding maximum iterations. A logical error may exist.");
}

return performedSwaps;
}

// Calculate Reward Credits based on turnover
calculateRewardCredits(turnover) {
let credits = 0;
let remainingTurnover = turnover;

// First slab: ₹0 to ₹200,000 = 10 credits
if (remainingTurnover > 0) {
const firstSlab = Math.min(remainingTurnover, 200000);
if (firstSlab >= 200000) {
credits += 10;
remainingTurnover -= 200000;
} else {
return 0; // Not enough for first slab
}
}

// Second slab: ₹200,001 to ₹700,000 = 15 credits
if (remainingTurnover > 0) {
const secondSlab = Math.min(remainingTurnover, 500000);
if (secondSlab >= 500000) {
credits += 15;
remainingTurnover -= 500000;
} else {
return credits; // Return credits earned so far
}
}

// Third slab: ₹700,001 to ₹1,700,000 = 20 credits
if (remainingTurnover > 0) {
const thirdSlab = Math.min(remainingTurnover, 1000000);
if (thirdSlab >= 1000000) {
credits += 20;
remainingTurnover -= 1000000;
} else {
return credits; // Return credits earned so far
}
}

// Fourth slab: Every additional ₹2,000,000 = 25 credits
if (remainingTurnover > 0) {
const fourthSlabCredits = Math.floor(remainingTurnover / 2000000) * 25;
credits += fourthSlabCredits;
}

return credits;
}

// Calculate franchise turnover (only from direct children)
calculateFranchiseTurnover(userId, franchise) {
const user = this.allNodes.get(userId);
if (!user) return 0;

if (franchise === 'A') {
return user.franchiseATurnover;
} else if (franchise === 'B') {
return user.franchiseBTurnover;
}

return 0;
}

// Update credit wallet with new credits
updateCreditWallet(userId, credits, franchise, turnover) {
const user = this.allNodes.get(userId);
if (!user) return { success: false, error: "User not found" };

const previousCredits = user.creditWallet;
user.creditWallet += credits;

// Add to credit history
const creditEntry = {
date: new Date().toLocaleDateString(),
franchise: franchise,
turnover: turnover,
creditsEarned: credits,
totalCredits: user.creditWallet
};

user.creditHistory.push(creditEntry);

return {
success: true,
previousCredits: previousCredits,
currentCredits: user.creditWallet,
creditsAdded: credits
};
}

monthlyConsolidation() {
const allUsers = Array.from(this.allNodes.values());
const creditAllocations = [];

// Step 1: Calculate all indirect incomes based on balanced volume.
allUsers.forEach(user => {
user.leftSubtreeSales = this.calculateSubtreeSales(user.left);
user.rightSubtreeSales = this.calculateSubtreeSales(user.right);

user.leftSubtreeSales += user.carryForwardLeft;
user.rightSubtreeSales += user.carryForwardRight;

const balancedVolume = Math.min(user.leftSubtreeSales, user.rightSubtreeSales);

// IMPORTANT FIX: Brand owners earn ONLY direct income, not indirect income
if (balancedVolume > 0 && user.userType !== 'brand_owner') {
user.indirectIncome += balancedVolume * 0.05;
}

user.carryForwardLeft = user.leftSubtreeSales - balancedVolume;
user.carryForwardRight = user.rightSubtreeSales - balancedVolume;
});

// Step 2: Calculate and allocate reward credits based on franchise turnover
allUsers.forEach(user => {
if (user.userType === 'customer') {
// Calculate credits for Franchise A (left side)
const creditsFromA = this.calculateRewardCredits(user.franchiseATurnover);
if (creditsFromA > 0) {
const creditResult = this.updateCreditWallet(user.id, creditsFromA, 'A', user.franchiseATurnover);
if (creditResult.success) {
creditAllocations.push({
userId: user.id,
userName: user.name,
franchise: 'A',
turnover: user.franchiseATurnover,
creditsAllocated: creditsFromA,
totalCredits: user.creditWallet
});
}
}

// Calculate credits for Franchise B (right side)
const creditsFromB = this.calculateRewardCredits(user.franchiseBTurnover);
if (creditsFromB > 0) {
const creditResult = this.updateCreditWallet(user.id, creditsFromB, 'B', user.franchiseBTurnover);
if (creditResult.success) {
creditAllocations.push({
userId: user.id,
userName: user.name,
franchise: 'B',
turnover: user.franchiseBTurnover,
creditsAllocated: creditsFromB,
totalCredits: user.creditWallet
});
}
}
}
});

// Step 3: Perform tree restructuring based on new total incomes.
const performedSwaps = this.restructureTreeBasedOnIncome();

return {
message: "Monthly consolidation completed",
totalUsers: allUsers.length,
swapsPerformed: performedSwaps.length,
swapDetails: performedSwaps,
creditAllocations: creditAllocations
};
}

calculateSubtreeSales(node) {
if (!node) return 0;
return node.totalSales +
this.calculateSubtreeSales(node.left) +
this.calculateSubtreeSales(node.right);
}

getTreeVisualization() {
const result = [];
const queue = [{ node: this.root, level: 0 }];

while (queue.length > 0) {
const { node, level } = queue.shift();

if (!result[level]) result[level] = [];

const directParentNode = node.directParentId ? this.allNodes.get(node.directParentId) : null;
const logicalParentNode = node.logicalParentId ? this.allNodes.get(node.logicalParentId) : null;

result[level].push({
id: node.id,
name: node.name,
email: node.email,
userType: node.userType,
brandName: node.brandName || '',
hasLeft: !!node.left,
hasRight: !!node.right,
leftChildId: node.left ? node.left.id : null,
rightChildId: node.right ? node.right.id : null,
directReferralsCount: node.directReferrals.length,
directReferralIds: node.directReferrals,
directParentId: node.directParentId,
directParentName: directParentNode ? directParentNode.name : '',
logicalParentId: node.logicalParentId,
logicalParentName: logicalParentNode ? logicalParentNode.name : '',
directIncome: node.directIncome,
indirectIncome: node.indirectIncome,
totalSales: node.totalSales,
level: node.level,
creditWallet: node.creditWallet,
franchiseATurnover: node.franchiseATurnover,
franchiseBTurnover: node.franchiseBTurnover,
eWallet: node.eWallet || 0,
hasMovedPosition: !!node.logicalParentId
});

if (node.left) queue.push({ node: node.left, level: level + 1 });
if (node.right) queue.push({ node: node.right, level: level + 1 });
}

return result;
}

getUserById(userId) {
return this.allNodes.get(userId);
}

// New methods for dashboard functionality
updateKYC(userId, kycData) {
const user = this.allNodes.get(userId);
if (!user) return { success: false, error: "User not found" };

user.kycData = kycData;
user.kycVerified = true;
return { success: true };
}

addBankAccount(userId, bankData) {
const user = this.allNodes.get(userId);
if (!user) return { success: false, error: "User not found" };
user.bankAccount = bankData;
return { success: true };
}

getFranchiseA(userId) {
const user = this.allNodes.get(userId);
if (!user) return null;
const getGrandchildren = (node) => {
if (!node) return [];
const grandchildren = [];
if (node.left) {
grandchildren.push({
id: node.left.id,
name: node.left.name,
joinDate: node.left.joinDate,
kycVerified: node.left.kycVerified,
purchaseValue: node.left.totalSales
});
grandchildren.push(...getGrandchildren(node.left));
}
if (node.right) {
grandchildren.push({
id: node.right.id,
name: node.right.name,
joinDate: node.right.joinDate,
kycVerified: node.right.kycVerified,
purchaseValue: node.right.totalSales
});
grandchildren.push(...getGrandchildren(node.right));
}
return grandchildren;
};
return {
direct: user.left ? {
id: user.left.id,
name: user.left.name,
joinDate: user.left.joinDate,
kycVerified: user.left.kycVerified,
purchaseValue: user.left.totalSales
} : null,
grandchildren: getGrandchildren(user.left)
};
}

getFranchiseB(userId) {
const user = this.allNodes.get(userId);
if (!user) return null;
const getGrandchildren = (node) => {
if (!node) return [];
const grandchildren = [];
if (node.left) {
grandchildren.push({
id: node.left.id,
name: node.left.name,
joinDate: node.left.joinDate,
kycVerified: node.left.kycVerified,
purchaseValue: node.left.totalSales
});
grandchildren.push(...getGrandchildren(node.left));
}
if (node.right) {
grandchildren.push({
id: node.right.id,
name: node.right.name,
joinDate: node.right.joinDate,
kycVerified: node.right.kycVerified,
purchaseValue: node.right.totalSales
});
grandchildren.push(...getGrandchildren(node.right));
}
return grandchildren;
};
return {
direct: user.right ? {
id: user.right.id,
name: user.right.name,
joinDate: user.right.joinDate,
kycVerified: user.right.kycVerified,
purchaseValue: user.right.totalSales
} : null,
grandchildren: getGrandchildren(user.right)
};
}

getHierarchy(userId) {
const user = this.allNodes.get(userId);
if (!user) return null;
let parent = null;
if (user.directParentId) {
const parentNode = this.allNodes.get(user.directParentId);
if (parentNode) parent = { id: parentNode.id, name: parentNode.name, level: parentNode.level, kycVerified: parentNode.kycVerified };
}
const children = [];
if (user.left) children.push({ id: user.left.id, name: user.left.name, level: user.left.level, kycVerified: user.left.kycVerified, position: 'left' });
if (user.right) children.push({ id: user.right.id, name: user.right.name, level: user.right.level, kycVerified: user.right.kycVerified, position: 'right' });
return { parent, user: { id: user.id, name: user.name, level: user.level, kycVerified: user.kycVerified }, children };
}

getFinancialData(userId) {
const user = this.allNodes.get(userId);
if (!user) return null;
let franchiseAPurchaseValue = 0;
let franchiseBPurchaseValue = 0;
if (user.left) franchiseAPurchaseValue = this.calculateSubtreeSales(user.left);
if (user.right) franchiseBPurchaseValue = this.calculateSubtreeSales(user.right);
return {
directIncome: user.directIncome,
indirectIncome: user.indirectIncome,
incomeWallet: user.directIncome + user.indirectIncome,
eWallet: user.eWallet || 0,
creditWallet: user.creditWallet,
franchiseAPurchaseValue: franchiseAPurchaseValue,
franchiseBPurchaseValue: franchiseBPurchaseValue,
franchiseATurnover: user.franchiseATurnover,
franchiseBTurnover: user.franchiseBTurnover,
totalPayout: user.directIncome + user.indirectIncome
};
}

// Method to get credit history
getCreditHistory(userId) {
const user = this.allNodes.get(userId);
if (!user) return [];
return user.creditHistory || [];
}

// Method to update credit wallet balance (for external updates)
updateCreditWalletBalance(userId, newBalance) {
const user = this.allNodes.get(userId);
if (!user) return { success: false, error: "User not found" };

const previousBalance = user.creditWallet;
user.creditWallet = newBalance;

return {
success: true,
previousBalance: previousBalance,
currentBalance: newBalance
};
}

// Method to update e-wallet balance (for external updates)
updateEWalletBalance(userId, newBalance) {
const user = this.allNodes.get(userId);
if (!user) return { success: false, error: "User not found" };

const previousBalance = user.eWallet || 0;
user.eWallet = newBalance;

return {
success: true,
previousBalance: previousBalance,
currentBalance: newBalance
};
}

// Method to update income wallet balance (for external updates)
updateIncomeWalletBalance(userId, newBalance) {
const user = this.allNodes.get(userId);
if (!user) return { success: false, error: "User not found" };

const previousBalance = user.incomeWallet || 0;
user.incomeWallet = newBalance;

return {
success: true,
previousBalance: previousBalance,
currentBalance: newBalance
};
}

// Product management methods for brand owners
addProduct(userId, product) {
const user = this.allNodes.get(userId);
if (!user || user.userType !== 'brand_owner') return { success: false, error: "User not found or not a brand owner" };
if (!user.products) user.products = [];
user.products.push(product);
return { success: true };
}

updateProduct(userId, product) {
const user = this.allNodes.get(userId);
if (!user || user.userType !== 'brand_owner') return { success: false, error: "User not found or not a brand owner" };
if (!user.products) user.products = [];

const index = user.products.findIndex(p => p.id === product.id);
if (index === -1) return { success: false, error: "Product not found" };

user.products[index] = product;
return { success: true };
}

deleteProduct(userId, productId) {
const user = this.allNodes.get(userId);
if (!user || user.userType !== 'brand_owner') return { success: false, error: "User not found or not a brand owner" };
if (!user.products) user.products = [];
user.products = user.products.filter(p => p.id !== productId);
return { success: true };
}

getProducts(userId) {
const user = this.allNodes.get(userId);
if (!user || user.userType !== 'brand_owner') return [];
return user.products || [];
}
}

const treeManager = new MLMTreeManager();

// Updated TreeVisualization
function TreeVisualization({ onRunConsolidation }) {
  const [treeData, setTreeData] = useState([]);
  const [expandedLevels, setExpandedLevels] = useState(new Set([0, 1, 2]));
  const [showRepositioningInfo, setShowRepositioningInfo] = useState(true);
  
  useEffect(() => {
    refreshTree();
  }, []);

  const refreshTree = () => {
    setTreeData(treeManager.getTreeVisualization());
  };

  const toggleLevel = (level) => {
    const newExpanded = new Set(expandedLevels);
    if (newExpanded.has(level)) {
      newExpanded.delete(level);
    } else {
      newExpanded.add(level);
    }
    setExpandedLevels(newExpanded);
  };

  const getUserTypeColor = (userType) => {
    switch(userType) {
      case 'founder': return 'bg-yellow-50 border-yellow-400 text-yellow-900';
      case 'customer': return 'bg-blue-50 border-blue-300 text-blue-900';
      case 'brand_owner': return 'bg-purple-50 border-purple-300 text-purple-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getUserTypeBadge = (userType) => {
    switch(userType) {
      case 'founder': return 'bg-yellow-200 text-yellow-800';
      case 'customer': return 'bg-blue-200 text-blue-800';
      case 'brand_owner': return 'bg-purple-200 text-purple-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  // Calculate reward credits based on turnover
  const calculateRewardCredits = (turnover) => {
    let credits = 0;
    let remainingTurnover = turnover;
    
    // First slab: ₹200,000 for 10 credits
    if (remainingTurnover > 0) {
      const firstSlab = Math.min(remainingTurnover, 200000);
      if (firstSlab >= 200000) {
        credits += 10;
      }
      remainingTurnover -= firstSlab;
    }
    
    // Second slab: Next ₹500,000 for 15 credits
    if (remainingTurnover > 0) {
      const secondSlab = Math.min(remainingTurnover, 500000);
      if (secondSlab >= 500000) {
        credits += 15;
      }
      remainingTurnover -= secondSlab;
    }
    
    // Third slab: Next ₹1,000,000 for 20 credits
    if (remainingTurnover > 0) {
      const thirdSlab = Math.min(remainingTurnover, 1000000);
      if (thirdSlab >= 1000000) {
        credits += 20;
      }
      remainingTurnover -= thirdSlab;
    }
    
    // Fourth slab: Every ₹2,000,000 for 25 credits
    if (remainingTurnover > 0) {
      const additionalSlabs = Math.floor(remainingTurnover / 2000000);
      credits += additionalSlabs * 25;
    }
    
    return credits;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto pt-20">
        <div className="bg-white p-6 rounded-xl shadow-xl mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">Binary Tree Visualization</h3>
              <p className="text-sm text-gray-600">BFS Allocation: Left to Right, Top to Bottom</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={refreshTree}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition transform hover:scale-105"
              >
                🔄 Refresh
              </button>
              <button
                onClick={() => {
                  const result = treeManager.monthlyConsolidation();
                  
                  let alertMessage = `${result.message}\n\nTotal Users: ${result.totalUsers}`;
                  
                  if (result.swapsPerformed > 0) {
                    alertMessage += `\n\n🔄 Tree Restructured: ${result.swapsPerformed} swap(s) performed.`;
                    alertMessage += `\n\n--- Swap Details ---`;
                    result.swapDetails.forEach(swap => {
                      alertMessage += `\n\nChild (${swap.childId}) earned more than Parent (${swap.parentId}).`;
                      alertMessage += `\n  - ${swap.childName}: ₹${swap.childIncome.toFixed(2)}`;
                      alertMessage += `\n  - ${swap.parentName}: ₹${swap.parentIncome.toFixed(2)}`;
                    });
                  } else {
                    alertMessage += `\n\n✅ No tree restructuring was needed.`;
                  }

                  if (result.creditAllocations && result.creditAllocations.length > 0) {
                    alertMessage += `\n\n🏆 Reward Credits Allocated: ${result.creditAllocations.length} user(s) received credits.`;
                  } else {
                    alertMessage += `\n\n🏆 No reward credits were allocated in this cycle.`;
                  }
                  
                  alertMessage += `\n\n💡 Note: Brand owners earn DIRECT income only.`;
                  alert(alertMessage);
                  
                  refreshTree();
                  if (onRunConsolidation) onRunConsolidation();
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition transform hover:scale-105"
              >
                💰 Monthly Consolidation
              </button>
              <button
                onClick={() => setShowRepositioningInfo(!showRepositioningInfo)}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-medium transition transform hover:scale-105"
              >
                {showRepositioningInfo ? '🙈' : '👁️'} Repositioning Info
              </button>
            </div>
          </div>
          
          <div className="mb-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-50 border-2 border-yellow-400 rounded"></div>
              <span className="font-medium">Founder (Static Position)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-50 border-2 border-blue-300 rounded"></div>
              <span className="font-medium">Customer (Can be Repositioned)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-50 border-2 border-purple-300 rounded"></div>
              <span className="font-medium">Brand Owner (Static Position)</span>
            </div>
            {showRepositioningInfo && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-50 border-2 border-orange-400 rounded"></div>
                <span className="font-medium">Repositioned Node</span>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {treeData.map((level, levelIndex) => (
              <div key={levelIndex} className="border-t pt-4">
                <button
                  onClick={() => toggleLevel(levelIndex)}
                  className="flex items-center gap-2 mb-3 text-lg font-semibold text-gray-700 hover:text-gray-900 transition"
                >
                  <span className="text-blue-600">{expandedLevels.has(levelIndex) ? '▼' : '▶'}</span>
                  <span>Level {levelIndex}</span>
                  <span className="text-sm font-normal text-gray-500">({level.length} users)</span>
                </button>
                
                {expandedLevels.has(levelIndex) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {level.map((user) => {
                      // Calculate total turnover from both franchises
                      const totalTurnover = user.franchiseATurnover + user.franchiseBTurnover;
                      // Calculate potential credits based on turnover
                      const potentialCredits = calculateRewardCredits(totalTurnover);
                      
                      return (
                      <div
                        key={user.id}
                        className={`border-2 rounded-xl px-4 py-4 text-sm shadow-md hover:shadow-lg transition ${
                          user.hasMovedPosition && showRepositioningInfo 
                            ? 'bg-orange-50 border-orange-400 text-orange-900' 
                            : getUserTypeColor(user.userType)
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-lg">{user.id}</div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getUserTypeBadge(user.userType)}`}>
                            {user.userType.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        {user.hasMovedPosition && showRepositioningInfo && user.logicalParentId && (
                          <div className="mb-2 p-2 bg-orange-100 border border-orange-300 rounded">
                            <div className="text-xs font-semibold text-orange-800">
                              🔄 Visually Repositioned:
                            </div>
                            <div className="text-xs text-orange-700 mt-1">
                              Logical Parent: {user.logicalParentId} - {user.logicalParentName}
                            </div>
                          </div>
                        )}
                        
                        <div className="font-semibold text-base mb-1">{user.name}</div>
                        {user.brandName && (
                          <div className="text-xs italic mb-1 text-purple-700 font-medium">
                            🏢 {user.brandName}
                          </div>
                        )}
                        <div className="text-xs mb-3 text-gray-600">{user.email}</div>
                        
                        {user.directParentId && (
                          <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded">
                            <div className="text-xs font-semibold text-green-800">
                              👤 Direct Parent (Sponsor):
                            </div>
                            <div className="text-xs text-green-700 mt-1">
                              {user.directParentId} - {user.directParentName}
                            </div>
                          </div>
                        )}
                        
                        <div className="border-t pt-2 mb-2">
                          <div className="text-xs font-semibold mb-1 text-gray-700">Tree Structure:</div>
                          <div className="flex gap-2 text-xs">
                            <span className={`px-2 py-1 rounded ${user.hasLeft ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              L: {user.hasLeft ? `✓ ${user.leftChildId}` : '✗'}
                            </span>
                            <span className={`px-2 py-1 rounded ${user.hasRight ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              R: {user.hasRight ? `✓ ${user.rightChildId}` : '✗'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="border-t pt-2 mb-2">
                          <div className="text-xs font-semibold mb-1 text-gray-700">
                            Direct Referrals: {user.directReferralsCount}
                          </div>
                          {user.directReferralIds.length > 0 && (
                            <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
                              {user.directReferralIds.map((refId, idx) => (
                                <div key={idx} className="text-xs bg-blue-50 px-2 py-1 rounded mb-1">
                                  {idx + 1}. {refId}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* --- UPDATED SECTION: Franchise Turnover --- */}
                        <div className="border-t pt-2 mb-2">
                          <div className="text-xs font-semibold mb-1 text-gray-700 flex items-center gap-1">
                            <TrendingUp size={12} /> Franchise Turnover:
                          </div>
                          <div className="flex gap-2 text-xs">
                            <span className="font-medium text-blue-700">A: ₹{user.franchiseATurnover.toFixed(2)}</span>
                            <span className="font-medium text-blue-700">B: ₹{user.franchiseBTurnover.toFixed(2)}</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Total: ₹{totalTurnover.toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="border-t pt-2 space-y-1">
                          <div className="text-xs text-green-700 font-semibold">
                            💵 Direct Income: ₹{user.directIncome.toFixed(2)}
                          </div>
                          <div className={`text-xs font-semibold ${
                            user.userType === 'brand_owner' 
                              ? 'text-gray-400 line-through' 
                              : 'text-blue-700'
                          }`}>
                            💰 Indirect Income: ₹{user.indirectIncome.toFixed(2)}
                            {user.userType === 'brand_owner' && (
                              <span className="text-red-600 ml-1">(N/A)</span>
                            )}
                          </div>
                          <div className="text-xs font-medium text-gray-700">
                            📊 Total Sales: ₹{user.totalSales.toFixed(2)}
                          </div>
                          
                          {/* --- UPDATED SECTION: Reward Credits --- */}
                          <div className="border-t pt-2 mt-2">
                            <div className="text-xs font-semibold text-purple-700 flex items-center gap-1 mb-1">
                              <Award size={12} /> Reward Credits: {user.creditWallet}
                            </div>
                            <div className="text-xs text-purple-600 mb-1">
                              Potential from current turnover: {potentialCredits} credits
                            </div>
                            <div className="text-xs text-gray-500">
                              1 Credit = ₹100 (for product purchases)
                            </div>
                          </div>
                        </div>
                      </div>
                      )})}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm mb-6">
          <div className="font-semibold text-blue-900 mb-2">📋 Multiple Direct Children System:</div>
          <ul className="space-y-1 text-blue-800">
            <li>✅ <strong>Direct Parent (Sponsor):</strong> The person who referred you - receives direct income from your sales</li>
            <li>✅ <strong>Tree Placement:</strong> For 3+ children, placed in sponsor's subtree using BFS for balance</li>
            <li>✅ <strong>Income Rules:</strong> Direct income goes to your sponsor, indirect income flows through tree structure</li>
            <li>⚠️ <strong>Brand Owners:</strong> Earn ONLY direct income (no indirect income)</li>
          </ul>
        </div>

        {/* --- UPDATED SECTION: Reward Credits System --- */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm mb-6">
          <div className="font-semibold text-purple-900 mb-2">🏆 Reward Credits System:</div>
          <ul className="space-y-1 text-purple-800">
            <li>✅ <strong>Turnover-Based Rewards:</strong> Credits are earned based on the total purchase value from direct and indirect children in both Franchise A and Franchise B.</li>
            <li>✅ <strong>Tiered Structure:</strong> 
              <ul className="ml-4 mt-1 list-disc list-inside">
                <li>First ₹200,000 turnover: 10 Credits</li>
                <li>Next ₹500,000 turnover: 15 Credits</li>
                <li>Next ₹1,000,000 turnover: 20 Credits</li>
                <li>Every additional ₹2,000,000: 25 Credits</li>
              </ul>
            </li>
            <li>✅ <strong>Automatic Allocation:</strong> Credits are automatically calculated and added to your Credit Wallet during the monthly consolidation.</li>
            <li>✅ <strong>Usage:</strong> Credits can be used for purchases on the ecommerce platform (1 Credit = ₹100).</li>
            <li>✅ <strong>Combined Turnover:</strong> Credits are calculated based on the combined turnover from both Franchise A and Franchise B.</li>
          </ul>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm mb-20">
          <div className="font-semibold text-orange-900 mb-2">🔄 Tree Restructuring Rules:</div>
          <ul className="space-y-1 text-orange-800">
            <li>✅ <strong>Customer Greater than Customer:</strong> If a customer earns more than their customer parent, they swap positions.</li>
            <li>✅ <strong>Static Positions:</strong> Founders and Brand Owners cannot be moved and remain in their original positions.</li>
            <li>✅ <strong>Automatic Process:</strong> Restructuring happens automatically after monthly consolidation.</li>
            <li>✅ <strong>Visual Indicators:</strong> Repositioned nodes are highlighted in orange (currently disabled for stability).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Updated Header Component
const Header = ({ 
  setCurrentPage, 
  setShowAuth, 
  searchQuery, 
  setSearchQuery,
  isCompanyDropdownOpen,
  setIsCompanyDropdownOpen,
  companyDropdownRef,
  user,
  onLogout,
  onProfileClick,
  showSecondaryHeader = false,
  secondaryTitle = '',
  onMenuClick,
  onPortalClick
}) => {
  const { cartItems, wishlistItems } = useContext(CartContext);
  
  // States for menu drawer
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuSection, setActiveMenuSection] = useState('menu');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showChangePhoneModal, setShowChangePhoneModal] = useState(false);
  const [showSkip2FAModal, setShowSkip2FAModal] = useState(false);
  
  // New states for additional menu sections
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    accountAlerts: true,
    recommendations: false
  });
  
  // Profile states
  const [userAvatar, setUserAvatar] = useState(user.avatar || '');
  const [userName, setUserName] = useState(user.name || '');
  const [userMobile, setUserMobile] = useState(user.mobile || '');
  const [userEmail, setUserEmail] = useState(user.email || '');
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // 2FA states
  const [phoneNumber, setPhoneNumber] = useState(user.mobile || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  
  // Feedback states
  const [ratings, setRatings] = useState({
    easeOfUse: 0,
    features: 0,
    performance: 0,
    customerSupport: 0,
    valueForMoney: 0,
    overallExperience: 0
  });
  const [recommendationRating, setRecommendationRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  
  // Countdown timer for OTP
  useEffect(() => {
    if (codeSent && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [codeSent, countdown]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPage('all');
    }
  };
  
  const handleMenuClick = () => {
    setIsMenuOpen(true);
    setActiveMenuSection('menu');
  };
  
  const handleProfileClick = () => {
    setActiveMenuSection('profile');
  };
  
  const handlePasswordClick = () => {
    setActiveMenuSection('password');
  };
  
  const handle2FAClick = () => {
    setActiveMenuSection('2fa');
  };
  
  // New handlers for menu items
  const handleOrdersClick = () => {
    setActiveMenuSection('orders');
  };
  
  const handleBrandsClick = () => {
    setActiveMenuSection('brands');
  };
  
  const handleCreditsClick = () => {
    setActiveMenuSection('credits');
  };
  
  const handleChallengesClick = () => {
    setActiveMenuSection('challenges');
  };
  
  const handleSettingsClick = () => {
    setActiveMenuSection('settings');
  };
  
  const handleFeedbackClick = () => {
    setActiveMenuSection('feedback');
  };
  
  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };
  
  const handleConfirmLogout = () => {
    onLogout();
    setShowLogoutConfirmation(false);
    setIsMenuOpen(false);
  };
  
  const handleCancelLogout = () => {
    setShowLogoutConfirmation(false);
  };
  
  const handleBackToMenu = () => {
    setActiveMenuSection('menu');
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }
    
    // In a real app, this would call an API to change the password
    alert('Password changed successfully');
    setShowPasswordModal(false);
    onLogout(); // Log out after password change
  };
  
  const handleSendVerificationCode = () => {
    // In a real app, this would send an OTP to the phone number
    setCodeSent(true);
    setCountdown(60);
  };
  
  const handleVerifyCode = () => {
    // In a real app, this would verify the OTP
    alert('Phone number verified successfully');
    setShowPhoneVerification(false);
    setCodeSent(false);
    setActiveMenuSection('2fa');
  };
  
  const handleChangePhoneNumber = () => {
    setShowChangePhoneModal(true);
  };
  
  const handleConfirmChangePhone = () => {
    setShowChangePhoneModal(false);
    setCodeSent(false);
    setPhoneNumber('');
    setVerificationCode('');
  };
  
  const handleSkip2FA = () => {
    setShowSkip2FAModal(true);
  };
  
  const handleConfirmSkip2FA = () => {
    setShowSkip2FAModal(false);
    setShowPhoneVerification(false);
    setActiveMenuSection('2fa');
  };
  
  const handleFeedbackSubmit = () => {
    // In a real app, this would submit the feedback
    alert('Thank you for your feedback');
    setShowFeedbackModal(false);
    setRatings({
      easeOfUse: 0,
      features: 0,
      performance: 0,
      customerSupport: 0,
      valueForMoney: 0,
      overallExperience: 0
    });
    setRecommendationRating(0);
    setFeedbackText('');
  };
  
  // Handler for notification settings
  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const renderMenuDrawer = () => {
    return (
      <div className={`fixed inset-0 z-50 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)}></div>
        <div className="fixed left-0 top-0 h-full w-96 bg-gradient-to-br from-white to-gray-50 shadow-2xl overflow-y-auto transform transition-transform duration-300">
          {activeMenuSection === 'menu' && renderMenuContent()}
          {activeMenuSection === 'profile' && renderProfileContent()}
          {activeMenuSection === 'password' && renderPasswordContent()}
          {activeMenuSection === '2fa' && render2FAContent()}
          {activeMenuSection === 'orders' && renderOrdersContent()}
          {activeMenuSection === 'brands' && renderBrandsContent()}
          {activeMenuSection === 'credits' && renderCreditsContent()}
          {activeMenuSection === 'challenges' && renderChallengesContent()}
          {activeMenuSection === 'settings' && renderSettingsContent()}
          {activeMenuSection === 'feedback' && renderFeedbackContent()}
        </div>
      </div>
    );
  };
  
  const renderMenuContent = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold">Menu</h2>
        </div>
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          aria-label="Close"
        >
          <X size={22} />
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/*<div className="mb-8 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-xl text-gray-800">Welcome Back</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Manage your account, settings, and preferences all in one place.
            </p>
          </div>*/}
          
          {/* User Profile Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="relative group">
                {userAvatar ? (
                  <div className="relative">
                    <img src={userAvatar} alt="User Avatar" className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-200 shadow-lg" />
                    {/*<div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>*/}
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center ring-4 ring-blue-200 shadow-lg">
                      <User size={48} className="text-white" />
                    </div>
                    {/* <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>*/}
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold text-gray-800">{userName}</h3>
                <p className="text-sm text-gray-600">View and manage your profile</p>
              </div>
            </div>
          </div>
          
          {/* Menu Options */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center mb-4">
              {/*<div className="p-2 bg-blue-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">Quick Actions</h4>*/}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleProfileClick}
                className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200 mb-3">
                  <User size={24} className="text-blue-600" />
                </div>
                <span className="font-semibold text-gray-700">Your Profile</span>
              </button>
              
              <button 
                onClick={handlePasswordClick}
                className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-200 mb-3">
                  <Lock size={24} className="text-purple-600" />
                </div>
                <span className="font-semibold text-gray-700">Password</span>
              </button>
              
              <button 
                onClick={handle2FAClick}
                className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-200 mb-3">
                  <Shield size={24} className="text-green-600" />
                </div>
                <span className="font-semibold text-gray-700">Two-Factor Authentication</span>
              </button>
              
              <button 
                onClick={handleOrdersClick}
                className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <div className="p-3 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors duration-200 mb-3">
                  <Package size={24} className="text-teal-600" />
                </div>
                <span className="font-semibold text-gray-700">Orders</span>
              </button>
              
              <button 
                onClick={handleBrandsClick}
                className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors duration-200 mb-3">
                  <Tag size={24} className="text-indigo-600" />
                </div>
                <span className="font-semibold text-gray-700">Brands</span>
              </button>
              
              <button 
                onClick={handleCreditsClick}
                className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors duration-200 mb-3">
                  <Coins size={24} className="text-yellow-600" />
                </div>
                <span className="font-semibold text-gray-700">Credits</span>
              </button>
              
              <button 
                onClick={handleChallengesClick}
                className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <div className="p-3 bg-rose-100 rounded-lg group-hover:bg-rose-200 transition-colors duration-200 mb-3">
                  <Trophy size={24} className="text-rose-600" />
                </div>
                <span className="font-semibold text-gray-700">Challenges</span>
              </button>
              
              <button 
                onClick={handleSettingsClick}
                className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors duration-200 mb-3">
                  <Settings size={24} className="text-slate-600" />
                </div>
                <span className="font-semibold text-gray-700">Settings</span>
              </button>
              
              <button 
                onClick={handleFeedbackClick}
                className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors duration-200 mb-3">
                  <MessageSquare size={24} className="text-orange-600" />
                </div>
                <span className="font-semibold text-gray-700">Feedback</span>
              </button>
            </div>
          </div>
          
          {/* Logout Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <button 
              onClick={handleLogoutClick}
              className="flex items-center w-full p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors duration-200 mr-4">
                <LogOut size={24} className="text-red-600" />
              </div>
              <span className="font-semibold text-gray-700">Logout</span>
            </button>
          </div>
          
          {/* Menu Benefits
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 shadow-sm mb-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">Menu Benefits</h4>
            </div>
            <p className="text-gray-600 mb-3">
              Access all your account features and settings from one convenient location.
            </p>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <p className="text-gray-600">
                <span className="font-semibold">Quick Access:</span> Navigate to any section of your account with just one click.
              </p>
            </div>
          </div> */}
          
          
          {/* <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-sm text-blue-800 font-medium">Need help? Contact our support team for assistance</p>
            </div>
          </div>
           */}
        </div>
      </div>
    </div>
  );
};
  
  // New render functions for the additional menu sections
 const renderOrdersContent = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Package size={24} />
          </div>
          <h2 className="text-xl font-bold">My Orders</h2>
        </div>
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          aria-label="Close"
        >
          <X size={22} />
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 p-8 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-200 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-teal-100 rounded-full mr-3">
                <Package className="text-teal-600" size={28} />
              </div>
              <h3 className="font-bold text-xl text-gray-800">Order History</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Track and manage all your orders in one place. View order status, delivery details, and more.
            </p>
            
            <button 
              onClick={() => {/* Add browse products functionality */}}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 mt-6"
            >
              <Package size={20} />
              <span>Browse Products</span>
            </button>
          </div>
          
          {/* Empty State */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <Package size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
              <p className="text-gray-500 text-center mb-6">Your order history will appear here once you make a purchase</p>
              
              <button 
                onClick={() => {/* Add browse products functionality */}}
                className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <span>Start Shopping</span>
              </button>
            </div>
          </div>
          
          {/* Additional Information Card */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl border border-blue-200 shadow-sm mt-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">Order Tracking</h4>
            </div>
            <p className="text-gray-600 mb-3">
              Stay updated on your order status with real-time tracking information.
            </p>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-teal-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-gray-600">
                <span className="font-semibold">Delivery Updates:</span> Receive notifications about your order status, from processing to delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - No border line */}
      <div className="p-6 bg-gray-50">
        <button 
          onClick={handleBackToMenu}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Back to Menu</span>
        </button>
      </div>
    </div>
  );
};
  
 const renderBrandsContent = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Tag size={24} />
          </div>
          <h2 className="text-xl font-bold">Select Your Favourite Brands</h2>
        </div>
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          aria-label="Close"
        >
          <X size={22} />
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-indigo-100 rounded-full mr-3">
                <Tag className="text-indigo-600" size={28} />
              </div>
              <h3 className="font-bold text-xl text-gray-800">Brand Selection</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Choose from our curated selection of premium brands. We're constantly adding new brands to enhance your shopping experience.
            </p>
            
            <button 
              onClick={() => {/* Add explore brands functionality */}}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 mt-6"
            >
              <Tag size={20} />
              <span>Explore All Brands</span>
            </button>
          </div>
          
          {/* Brand Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-indigo-200 hover:border-indigo-400 hover:scale-[1.02]">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center mb-3">
                  <Tag size={32} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">Engineers</h3>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-indigo-200 hover:border-indigo-400 hover:scale-[1.02]">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Designers</h3>
              </div>
            </div>
          </div>
          
          {/* Coming Soon Notice */}
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-sm text-indigo-700 font-medium">More brands coming soon!</p>
            </div>
          </div>
          
          {/* Additional Information Card */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">Brand Benefits</h4>
            </div>
            <p className="text-gray-600 mb-3">
              Discover exclusive offers and products from your favorite brands.
            </p>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-gray-600">
                <span className="font-semibold">Exclusive Access:</span> Get early access to new collections and special promotions from your selected brands.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - No border line */}
      <div className="p-6 bg-gray-50">
        <button 
          onClick={handleBackToMenu}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Back to Menu</span>
        </button>
      </div>
    </div>
  );
};
  
  const renderCreditsContent = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Coins size={24} />
          </div>
          <h2 className="text-xl font-bold">My Credits</h2>
        </div>
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          aria-label="Close"
        >
          <X size={22} />
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 p-8 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-full mr-3">
                <Coins className="text-yellow-600" size={28} />
              </div>
              <h3 className="font-bold text-xl text-gray-800">Credits Balance</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Earn and redeem credits for exclusive rewards and discounts on your purchases.
            </p>
            
            <div className="flex items-center justify-between mt-6 mb-6 p-4 bg-white rounded-xl border border-yellow-200">
              <span className="text-lg font-semibold text-gray-700">Available Credits</span>
              <div className="flex items-center">
                <Coins size={24} className="text-yellow-500 mr-2" />
                <span className="text-2xl font-bold text-gray-800">0</span>
              </div>
            </div>
            
            <button 
              onClick={() => {/* Add earn credits functionality */}}
              className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Earn More Credits</span>
            </button>
          </div>
          
          {/* How to Earn Credits */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">How to Earn Credits</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                <CheckCircle size={20} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-gray-800">Complete Challenges</h5>
                  <p className="text-sm text-gray-600">Participate in special challenges to earn bonus credits</p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                <CheckCircle size={20} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-gray-800">Make Purchases</h5>
                  <p className="text-sm text-gray-600">Earn credits with every purchase you make</p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                <CheckCircle size={20} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-gray-800">Refer Friends</h5>
                  <p className="text-sm text-gray-600">Invite friends and earn credits when they join</p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                <CheckCircle size={20} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-gray-800">Write Reviews</h5>
                  <p className="text-sm text-gray-600">Share your experience and earn credits</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Credits Benefits */}
          <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 shadow-sm mb-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">Credits Benefits</h4>
            </div>
            <p className="text-gray-600 mb-3">
              Use your credits to unlock exclusive rewards and discounts.
            </p>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <p className="text-gray-600">
                <span className="font-semibold">Redeem for Discounts:</span> Exchange your credits for discounts on future purchases and exclusive products.
              </p>
            </div>
          </div>
          
          {/* Notice */}
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-sm text-yellow-800 font-medium">Credits can be redeemed for discounts on future purchases!</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - No border line */}
      <div className="p-6 bg-gray-50">
        <button 
          onClick={handleBackToMenu}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Back to Menu</span>
        </button>
      </div>
    </div>
  );
};
  
  const renderChallengesContent = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Trophy size={24} />
          </div>
          <h2 className="text-xl font-bold">Challenges</h2>
        </div>
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          aria-label="Close"
        >
          <X size={22} />
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 p-8 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-200 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-rose-100 rounded-full mr-3">
                <Trophy className="text-rose-600" size={28} />
              </div>
              <h3 className="font-bold text-xl text-gray-800">Challenge Rewards</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Participate in exciting challenges to earn credits and unlock exclusive rewards. Test your skills and compete with others!
            </p>
            
            <button 
              onClick={() => {/* Add explore challenges functionality */}}
              className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 mt-6"
            >
              <Trophy size={20} />
              <span>Explore Challenges</span>
            </button>
          </div>
          
          {/* Prize Credits */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">My Prize Credits</h3>
              <div className="flex items-center">
                <Coins size={24} className="text-yellow-500 mr-2" />
                <span className="text-2xl font-bold text-gray-800">0</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">Complete your first challenge to earn credits</p>
          </div>
          
          {/* Empty State */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <Trophy size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Challenges Available</h3>
              <p className="text-gray-500 text-center mb-6">Exciting challenges and credit rewards are on the way! Visit this page again soon to find out what's new.</p>
              
              <button 
                onClick={() => {/* Add browse products functionality */}}
                className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Check Back Later</span>
              </button>
            </div>
          </div>
          
          {/* Challenge Benefits */}
          <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-200 shadow-sm mb-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-pink-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">Challenge Benefits</h4>
            </div>
            <p className="text-gray-600 mb-3">
              Participating in challenges offers more than just credits.
            </p>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-rose-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <p className="text-gray-600">
                <span className="font-semibold">Exclusive Rewards:</span> Complete challenges to unlock special rewards, limited edition items, and bonus credits.
              </p>
            </div>
          </div>
          
          {/* Notice */}
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-rose-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-sm text-rose-800 font-medium">New challenges are added regularly. Check back often for more opportunities to earn credits!</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - No border line */}
      <div className="p-6 bg-gray-50">
        <button 
          onClick={handleBackToMenu}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Back to Menu</span>
        </button>
      </div>
    </div>
  );
};
  
  const renderSettingsContent = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-600 to-gray-600 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold">Settings</h2>
        </div>
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          aria-label="Close"
        >
          <X size={22} />
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 p-8 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-slate-100 rounded-full mr-3">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-xl text-gray-800">Account Settings</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Manage your account preferences and notification settings to customize your experience.
            </p>
            
            <button 
              onClick={() => {/* Add save settings functionality */}}
              className="w-full bg-gradient-to-r from-slate-600 to-gray-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 mt-6"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Save All Settings</span>
            </button>
          </div>
          
          {/* Notification Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">Manage Notifications</h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  <div>
                    <label htmlFor="orderUpdates" className="font-medium text-gray-800">Order Updates</label>
                    <p className="text-xs text-gray-500">Get notified about your order status</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="orderUpdates"
                    checked={notificationSettings.orderUpdates}
                    onChange={() => handleNotificationChange('orderUpdates')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <label htmlFor="promotions" className="font-medium text-gray-800">Promotions and Deals</label>
                    <p className="text-xs text-gray-500">Special offers and discounts</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="promotions"
                    checked={notificationSettings.promotions}
                    onChange={() => handleNotificationChange('promotions')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <div>
                    <label htmlFor="newsletter" className="font-medium text-gray-800">Newsletter</label>
                    <p className="text-xs text-gray-500">Weekly updates and news</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={notificationSettings.newsletter}
                    onChange={() => handleNotificationChange('newsletter')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  <div>
                    <label htmlFor="accountAlerts" className="font-medium text-gray-800">Account Alerts</label>
                    <p className="text-xs text-gray-500">Security and login notifications</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="accountAlerts"
                    checked={notificationSettings.accountAlerts}
                    onChange={() => handleNotificationChange('accountAlerts')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                  <div>
                    <label htmlFor="recommendations" className="font-medium text-gray-800">Product Recommendations</label>
                    <p className="text-xs text-gray-500">Personalized product suggestions</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="recommendations"
                    checked={notificationSettings.recommendations}
                    onChange={() => handleNotificationChange('recommendations')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Settings Benefits */}
          <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-200 shadow-sm mb-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-gray-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">Settings Benefits</h4>
            </div>
            <p className="text-gray-600 mb-3">
              Customize your experience with personalized settings.
            </p>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <p className="text-gray-600">
                <span className="font-semibold">Personalized Experience:</span> Tailor your notifications and preferences to match your needs and interests.
              </p>
            </div>
          </div>
          
          {/* Notice */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-slate-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-sm text-slate-800 font-medium">You can change these settings anytime from your account</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - No border line */}
      <div className="p-6 bg-gray-50">
        <button 
          onClick={handleBackToMenu}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Back to Menu</span>
        </button>
      </div>
    </div>
  );
};
  
  const renderProfileContent = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <User size={24} />
          </div>
          <h2 className="text-xl font-bold">Your Profile</h2>
        </div>
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          aria-label="Close"
        >
          <X size={22} />
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/*<div className="mb-8 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full mr-3">
                <User className="text-blue-600" size={28} />
              </div>
              <h3 className="font-bold text-xl text-gray-800">Profile Information</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Manage your personal information and social media connections to enhance your experience.
            </p>
            
            <button 
              onClick={() =>
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 mt-6"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Save Profile</span>
            </button>
          </div>*/}
          
          {/* Avatar Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
  <div className="flex flex-col items-center">
    {userAvatar ? (
      <div className="relative mb-4">
        <img src={userAvatar} alt="User Avatar" className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-200 shadow-lg" />
        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleAvatarChange}
            className="hidden" 
          />
        </label>
      </div>
    ) : (
      <div className="relative mb-4">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center ring-4 ring-blue-200 shadow-lg">
          <User size={48} className="text-white" />
        </div>
        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleAvatarChange}
            className="hidden" 
          />
        </label>
      </div>
    )}
  </div>
          </div>
          
          {/* Profile Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center mb-4">
              {/*<div className="p-2 bg-blue-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>*/}
              <h4 className="font-bold text-xl text-gray-800">Personal Information</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={userMobile}
                    onChange={(e) => setUserMobile(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={userEmail}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <Lock size={12} className="mr-1" />
                  Email cannot be changed
                </p>
              </div>
            </div>
          </div>
          
          {/* Social Media Accounts */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-pink-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">Connect Social Media</h4>
            </div>
            <p className="text-sm text-gray-600 mb-5">Stay connected with your customers</p>
            
            <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-pink-300 transition-all duration-200 bg-white">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center shadow-md">
                  <Instagram size={24} className="text-white" />
                </div>
                <span className="font-semibold ml-4 text-gray-700">Instagram</span>
              </div>
              <button className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                Connect
              </button>
            </div>
          </div>
          
          {/* Profile Benefits
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 shadow-sm mb-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">Profile Benefits</h4>
            </div>
            <p className="text-gray-600 mb-3">
              Complete your profile to unlock exclusive features and personalized experiences.
            </p>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <p className="text-gray-600">
                <span className="font-semibold">Personalized Experience:</span> A complete profile helps us tailor your experience and provide relevant recommendations.
              </p>
            </div>
          </div> */}
          
          {/* Notice
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-sm text-blue-800 font-medium">Your profile information is secure and will never be shared without your consent</p>
            </div>
          </div> */}
        </div>
      </div>
      
      {/* Footer - No border line */}
      <div className="p-6 bg-gray-50">
        <button 
          onClick={handleBackToMenu}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Back to Menu</span>
        </button>
      </div>
    </div>
  );
};
  
  const renderPasswordContent = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Lock size={24} />
          </div>
          <h2 className="text-xl font-bold">Password Security</h2>
        </div>
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          aria-label="Close"
        >
          <X size={22} />
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-full mr-3">
                <Lock className="text-purple-600" size={28} />
              </div>
              <h3 className="font-bold text-xl text-gray-800">Stay Secure</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Regularly updating your password enhances security and protects your account from unauthorized access.
            </p>
            
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 mt-6"
            >
              <Lock size={20} />
              <span>Change Password</span>
            </button>
          </div>
          
          {/* Additional Information Card */}
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">Password Best Practices</h4>
            </div>
            <p className="text-gray-600 mb-3">
              Creating strong passwords is essential for protecting your account.
            </p>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <p className="text-gray-600">
                <span className="font-semibold">Strong Password Tips:</span> Use a mix of uppercase, lowercase, numbers, and special characters. Avoid using personal information or common words.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - No border line */}
      <div className="p-6 bg-gray-50">
        <button 
          onClick={handleBackToMenu}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Back to Menu</span>
        </button>
      </div>
      
      {/* Password Change Modal - No border line */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
            <div className="flex justify-between items-center p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
              </div>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>
            
            <div className="px-6 pb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                      placeholder="Enter current password"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                      placeholder="Enter new password"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                      placeholder="Confirm new password"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button 
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePasswordChange}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
  
 const render2FAContent = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Shield size={24} />
          </div>
          <h2 className="text-xl font-bold">Two-Factor Authentication</h2>
        </div>
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          aria-label="Close"
        >
          <X size={22} />
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-full mr-3">
                <Shield className="text-green-600" size={28} />
              </div>
              <h3 className="font-bold text-xl text-gray-800">Extra Layer of Security</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Protect your account with two-factor authentication. You'll need both your password and a verification code to sign in.
            </p>
            
            <button 
              onClick={() => setShowPhoneVerification(true)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 mt-6"
            >
              <Shield size={20} />
              <span>Enable 2FA</span>
            </button>
          </div>
          
          {/* Combined Security Information Card */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-sm mb-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">Secure Your Account</h4>
            </div>
            <p className="text-gray-600 mb-3">
              2FA adds an additional layer of security to your account by requiring more than just a password to sign in.
            </p>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <p className="text-gray-600">
                <span className="font-semibold">Peace of Mind:</span> Even if someone has your password, they won't be able to access your account without the verification code.
              </p>
            </div>
          </div>
          
          {/* 2FA Benefits */}
          <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 shadow-sm mb-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">2FA Benefits</h4>
            </div>
            <p className="text-gray-600 mb-3">
              Two-factor authentication provides enhanced security for your account.
            </p>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <p className="text-gray-600">
                <span className="font-semibold">Enhanced Protection:</span> 2FA significantly reduces the risk of unauthorized access to your account, even if your password is compromised.
              </p>
            </div>
          </div>
          
          {/* Notice */}
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-sm text-green-800 font-medium">Enable 2FA to keep your account secure from unauthorized access</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - No border line */}
      <div className="p-6 bg-gray-50">
        <button 
          onClick={handleBackToMenu}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Back to Menu</span>
        </button>
      </div>
      
      {/* Phone Verification Modal - No border line */}
      {showPhoneVerification && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
      <div className="flex justify-between items-center p-6 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Phone Verification</h3>
        </div>
        <button 
          onClick={() => {
            setShowPhoneVerification(false);
            setCodeSent(false);
            setPhoneNumber('');
            setVerificationCode('');
          }}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
          aria-label="Close"
        >
          <X size={22} />
        </button>
      </div>
      
      <div className="px-6 pb-6">
        {!codeSent ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <div className="flex">
                <div className="bg-gray-100 px-4 py-2 border-2 border-r-0 border-gray-200 rounded-l-xl flex items-center font-semibold text-gray-700">
                  +91
                </div>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10 digit number"
                  maxLength={10}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-r-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">We'll send a verification code to this number</p>
            </div>
            
            <button 
              onClick={handleSendVerificationCode}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              <span>Send Verification Code</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center mb-1">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-sm font-medium text-green-800">Verification code sent</p>
              </div>
              <p className="text-sm text-gray-600">to: <span className="font-bold text-gray-800">+91 {phoneNumber}</span></p>
            </div>
            
            <div className="flex justify-between items-center">
              <label className="block text-sm font-bold text-gray-700">Verification Code</label>
              <button 
                onClick={handleChangePhoneNumber}
                className="text-green-600 text-sm font-semibold hover:underline flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Change Number
              </button>
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6 digit code"
                maxLength={6}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-center text-lg tracking-widest font-semibold"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
            </div>
            
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-500">Resend code in <span className="font-bold text-green-600">{countdown}s</span></p>
              ) : (
                <button 
                  onClick={handleSendVerificationCode}
                  className="text-green-600 text-sm font-semibold hover:underline flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Resend Verification Code
                </button>
              )}
            </div>
            
            <button 
              onClick={handleVerifyCode}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <span>Verify & Enable 2FA</span>
            </button>
            
            <div className="text-center pt-1">
              <button 
                onClick={handleSkip2FA}
                className="text-gray-500 text-sm hover:text-gray-700 font-semibold flex items-center justify-center mx-auto"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                I'll do this later
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
     )}
      
      {/* Change Phone Modal - No border line */}
      {showChangePhoneModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
      <div className="flex justify-between items-center p-6 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-100 rounded-lg">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Change Phone Number</h3>
        </div>
        <button 
          onClick={() => setShowChangePhoneModal(false)}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
          aria-label="Close"
        >
          <X size={22} />
        </button>
      </div>
      
      <div className="px-6 pb-6">
        <p className="text-gray-600 mb-4">Do you want to proceed with changing your phone number? You'll need to enter a new number and verify it.</p>
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> You'll need to verify the new phone number before it can be used for two-factor authentication.
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowChangePhoneModal(false)}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>Cancel</span>
          </button>
          <button 
            onClick={handleConfirmChangePhone}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Yes, Change</span>
          </button>
        </div>
      </div>
    </div>
  </div>
      )}
      
      {/* Skip 2FA Modal - No border line */}
      {showSkip2FAModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Skip 2FA Setup?</h3>
              </div>
              <button 
                onClick={() => setShowSkip2FAModal(false)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>
            
            <div className="px-6 pb-6">
              <p className="mb-4 text-gray-600">Are you sure you want to skip two-factor authentication?</p>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-6">
                <p className="text-sm text-amber-800">
                  <strong>Security Notice:</strong> Two-factor authentication significantly enhances your account security by requiring both your password and a verification code.
                </p>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowSkip2FAModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                >
                  Enable Now
                </button>
                <button 
                  onClick={handleConfirmSkip2FA}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                >
                  Skip for Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
  
  const renderFeedbackContent = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold">Share Your Feedback</h2>
        </div>
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          aria-label="Close"
        >
          <X size={22} />
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-orange-100 rounded-full mr-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-xl text-gray-800">We Value Your Feedback</h3>
            </div>
            {/* <div className="flex items-center mb-4">
              <div className="p-2 bg-orange-100 rounded-full mr-3">
                <span className="text-lg">👋</span>
              </div>
              <h3 className="font-bold text-xl text-gray-800">Hey, {userName}!</h3>
            </div>*/}
            <p className="text-gray-600 leading-relaxed">
              Your feedback helps us improve and serve you better. We appreciate you taking the time to share your thoughts with us.
            </p>
            
            <button 
              onClick={() => {/* Add learn more functionality */}}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 mt-6"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Learn More</span>
            </button>
          </div>
          
          {/* Rating Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <Star className="text-amber-600" size={20} />
              </div>
              <h4 className="font-semibold text-lg text-gray-800">Rate Your Experience</h4>
            </div>
            <p className="text-gray-600 text-sm mb-5">Click stars to rate from 1 (Poor) to 5 (Excellent)</p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-700">Ease of Use</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatings({...ratings, easeOfUse: star})}
                      className="transition-all duration-200 hover:scale-110"
                    >
                      {star <= ratings.easeOfUse ? (
                        <Star size={16} className="fill-amber-400 text-amber-400" />
                      ) : (
                        <Star size={16} className="text-gray-300 hover:text-amber-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-700">Features & Capabilities</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatings({...ratings, features: star})}
                      className="transition-all duration-200 hover:scale-110"
                    >
                      {star <= ratings.features ? (
                        <Star size={16} className="fill-amber-400 text-amber-400" />
                      ) : (
                        <Star size={16} className="text-gray-300 hover:text-amber-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-700">Performance</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatings({...ratings, performance: star})}
                      className="transition-all duration-200 hover:scale-110"
                    >
                      {star <= ratings.performance ? (
                        <Star size={16} className="fill-amber-400 text-amber-400" />
                      ) : (
                        <Star size={16} className="text-gray-300 hover:text-amber-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-700">Customer Support</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatings({...ratings, customerSupport: star})}
                      className="transition-all duration-200 hover:scale-110"
                    >
                      {star <= ratings.customerSupport ? (
                        <Star size={16} className="fill-amber-400 text-amber-400" />
                      ) : (
                        <Star size={16} className="text-gray-300 hover:text-amber-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-700">Value for Money</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatings({...ratings, valueForMoney: star})}
                      className="transition-all duration-200 hover:scale-110"
                    >
                      {star <= ratings.valueForMoney ? (
                        <Star size={16} className="fill-amber-400 text-amber-400" />
                      ) : (
                        <Star size={16} className="text-gray-300 hover:text-amber-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-700">Overall Experience</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatings({...ratings, overallExperience: star})}
                      className="transition-all duration-200 hover:scale-110"
                    >
                      {star <= ratings.overallExperience ? (
                        <Star size={16} className="fill-amber-400 text-amber-400" />
                      ) : (
                        <Star size={16} className="text-gray-300 hover:text-amber-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Recommendation Rating */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">Would you recommend us?</h4>
            </div>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRecommendationRating(star)}
                  className="transition-all duration-200 hover:scale-110 p-1"
                >
                  {star <= recommendationRating ? (
                    <Star size={28} className="fill-amber-400 text-amber-400" />
                  ) : (
                    <Star size={28} className="text-gray-300 hover:text-amber-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Additional Comments */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">Additional Comments</h4>
            </div>
            <textarea 
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Share any suggestions or thoughts to help us improve your experience..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 resize-none"
              rows={5}
            />
          </div>
          
          {/* Feedback Benefits */}
          <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-sm mb-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-gray-800">Why Your Feedback Matters</h4>
            </div>
            <p className="text-gray-600 mb-3">
              Your feedback helps us create a better experience for you and all our users.
            </p>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <p className="text-gray-600">
                <span className="font-semibold">Continuous Improvement:</span> We use your feedback to identify areas for improvement and implement changes that enhance your experience.
              </p>
            </div>
          </div>
          
          {/* Notice */}
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-sm text-orange-800 font-medium">Thank you for taking the time to share your feedback with us!</p>
            </div>
          </div>
          
          <button 
            onClick={handleFeedbackSubmit}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
            <span>Submit Feedback</span>
          </button>
        </div>
      </div>
      
      {/* Footer - No border line */}
      <div className="p-6 bg-gray-50">
        <button 
          onClick={handleBackToMenu}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Back to Menu</span>
        </button>
      </div>
    </div>
  );
};
  
  return (
    <>
      <header className="sticky top-0 bg-white z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-8xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Left Section - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold text-black">ENGINEERS</div>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-6 text-sm font-bold">
                <a 
                  href="#all" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('all');
                  }}
                  className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                >
                  All
                </a>
                
                <a 
                  href="#men" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('mens');
                  }}
                  className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                >
                  Men
                </a>
                
                <a 
                  href="#women" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('womens');
                  }}
                  className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                >
                  Women
                </a>
                
                <a 
                  href="#accessories" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('accessories');
                  }}
                  className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                >
                  Accessories
                </a>
                
                <a 
                  href="#home" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('landing');
                  }}
                  className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                >
                  Home
                </a>
                
                {/* 
                <div className="relative" ref={companyDropdownRef}>
                  <button 
                    onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                    className="text-gray-800 hover:text-black uppercase tracking-wide font-bold flex items-center space-x-1 transition-colors"
                  >
                    <span>Company</span>
                    {isCompanyDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isCompanyDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                      <a href="#founders" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">About Us</a>
                      <a href="#founders" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">News</a>
                      <a href="#entrepreneurs" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">Entrepreneurs</a>
                      <a href="#brand-owners" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">Brand Owners</a>
                      <a href="#founders" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">Founders</a>
                      <a href="#documents" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">Documents</a>
                      <a href="#founders" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">Bankings</a>
                      <a href="#feedback" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">Legals</a>
                    </div>
                  )}
                </div>
                
                <a href="#services" className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors">Services</a>
                <a href="#contact" className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors">Contact Us</a>*/}
              </div>
            </div>
            
            {/* Right Section - Search, Icons, and Menu Button */}
            <div className="flex items-center gap-4">

              {/* Notification Icon */}
              <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" class="cursor-pointer fill-[#333] inline w-5 h-5"
                    viewBox="0 0 371.263 371.263">
                    <path d="M305.402 234.794v-70.54c0-52.396-33.533-98.085-79.702-115.151.539-2.695.838-5.449.838-8.204C226.539 18.324 208.215 0 185.64 0s-40.899 18.324-40.899 40.899c0 2.695.299 5.389.778 7.964-15.868 5.629-30.539 14.551-43.054 26.647-23.593 22.755-36.587 53.354-36.587 86.169v73.115c0 2.575-2.096 4.731-4.731 4.731-22.096 0-40.959 16.647-42.995 37.845-1.138 11.797 2.755 23.533 10.719 32.276 7.904 8.683 19.222 13.713 31.018 13.713h72.217c2.994 26.887 25.869 47.905 53.534 47.905s50.54-21.018 53.534-47.905h72.217c11.797 0 23.114-5.03 31.018-13.713 7.904-8.743 11.797-20.479 10.719-32.276-2.036-21.198-20.958-37.845-42.995-37.845a4.704 4.704 0 0 1-4.731-4.731zM185.64 23.952c9.341 0 16.946 7.605 16.946 16.946 0 .778-.12 1.497-.24 2.275-4.072-.599-8.204-1.018-12.336-1.138-7.126-.24-14.132.24-21.078 1.198-.12-.778-.24-1.497-.24-2.275.002-9.401 7.607-17.006 16.948-17.006zm0 323.358c-14.431 0-26.527-10.3-29.342-23.952h58.683c-2.813 13.653-14.909 23.952-29.341 23.952zm143.655-67.665c.479 5.15-1.138 10.12-4.551 13.892-3.533 3.773-8.204 5.868-13.353 5.868H59.89c-5.15 0-9.82-2.096-13.294-5.868-3.473-3.772-5.09-8.743-4.611-13.892.838-9.042 9.282-16.168 19.162-16.168 15.809 0 28.683-12.874 28.683-28.683v-73.115c0-26.228 10.419-50.719 29.282-68.923 18.024-17.425 41.498-26.887 66.528-26.887 1.198 0 2.335 0 3.533.06 50.839 1.796 92.277 45.929 92.277 98.325v70.54c0 15.809 12.874 28.683 28.683 28.683 9.88 0 18.264 7.126 19.162 16.168z"
                    data-original="#000000" />
                  </svg>
                  <span className="absolute left-auto -ml-1 top-0 rounded-full bg-red-500 px-1 py-0 text-xs text-white">
                    0
                  </span>
                </div>
                <span className="text-[13px] font-semibold text-slate-900">Notifications</span>
              </div>

              {/* Search Icon */}
               <form onSubmit={handleSearch} className="hidden md:flex items-center border border-gray-300 rounded-md px-4 py-2 gap-2 w-72">
                 <Search size={16} className="text-gray-400 flex-shrink-0" />
                    <input 
                     type="text" 
                     placeholder="Search Products..." 
                     className="outline-none text-sm flex-1 bg-transparent"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
               </form>

              {/* Set Up Portal Button - Show for customer and brandowner dashboard */}
              {showSecondaryHeader && (secondaryTitle === "Customer Dashboard" || secondaryTitle === "Brand Owner Dashboard") && (
                <button
                onClick={onPortalClick}
                className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-green-500 rounded hover:from-green-700 hover:to-green-600 transition-all duration-300 ease-in-out hover:scale-105"
                >
                {secondaryTitle === "Customer Dashboard" ? "Set Up Portal" : "Portal Set Up"}
                </button>
            )}

              {/* Wishlist Icon */}
              <div 
                className="flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                onClick={() => setCurrentPage('wishlist')}
              >
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer fill-[#333] inline w-5 h-5"
                    viewBox="0 0 64 64">
                    <path
                      d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                      data-original="#000000" />
                  </svg>
                  <span className="absolute left-auto -ml-1 top-0 rounded-full bg-red-500 px-1 py-0 text-xs text-white">
                    {wishlistItems.length}
                  </span>
                </div>
                <span className="text-[13px] font-semibold text-slate-900">Wishlist</span>
              </div>
              
              {/* Cart Icon */}
              <div 
                className="flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                onClick={() => setCurrentPage('cart')}
              >
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" className="cursor-pointer fill-[#333] inline"
                    viewBox="0 0 512 512">
                    <path
                      d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0"
                      data-original="#000000"></path>
                    </svg>
                  <span className="absolute left-auto -ml-1 top-0 rounded-full bg-red-500 px-1 py-0 text-xs text-white">
                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                </div>
                <span className="text-[13px] font-semibold text-slate-900">Cart</span>
              </div>
              
              {/* User Icon */}
              {user ? (
               <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer" onClick={onProfileClick}>
                <div className="relative">
                  <User size={20} className="text-gray-700" />
                  <span className="absolute -top-1 -right-1 bg-green-500 w-2 h-2 rounded-full"></span>
                </div>
                  <span className="text-[13px] font-semibold text-slate-900">Profile</span>
               </div>
               ) : (
              <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                 <User size={20} className="text-gray-700" />
                  <span className="text-[13px] font-semibold text-slate-900">Account</span>
              </div>
             )}
              
              {/* Menu Button - Replaced Login/Sign Up Button */}
              <button 
                onClick={handleMenuClick}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Menu Drawer */}
      {renderMenuDrawer()}
      
      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
      <div className="flex justify-between items-center p-6 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-red-100 rounded-lg">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4 4m4-4H3a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Confirm Logout</h3>
        </div>
        <button 
          onClick={() => setShowLogoutConfirmation(false)}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
          aria-label="Close"
        >
          <X size={22} />
        </button>
      </div>
      
      <div className="px-6 pb-6">
        <p className="text-gray-600 mb-4">Are you sure you want to logout from your account?</p>
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> You'll need to login again to access your account.
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={handleCancelLogout}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>Cancel</span>
          </button>
          <button 
            onClick={handleConfirmLogout}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4 4m4-4H3a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
            </svg>
            <span>Yes, Logout</span>
          </button>
        </div>
      </div>
    </div>
  </div>
      )}
    </>
  );
};

// Updated Footer Component
const Footer = () => {
  return (
    <footer className="py-12 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6">About Us</h3>
            <p className="block text-gray-300 hover:text-white font-semibold">
              We are a leading fashion company dedicated to bringing you the latest trends and styles for both men and women.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Quick Links</h3>
            <div className="space-y-2">
              <a href="#banking" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Banking
              </a>
              <a href="#documents" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Documents
              </a>
              <a href="#business-affiliate" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Business Affiliate
              </a>
              <a href="#register" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Register
              </a>
              <a href="#login" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Login
              </a>
              <a href="#contact" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Contact Us
              </a>
            </div>
          </div>

          {/* Need Help */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Need Help?</h3>
            <div className="space-y-4">
              <a href="#privacy-policy" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Privacy Policy
              </a>
              <a href="#refund-policy" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Refund Policy
              </a>
              <a href="#return-refund-policy" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Return Refund Policy Goods
              </a>
              <a href="#buy-back-policy" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Buy Back Policy
              </a>
              <a href="#grievance-redressal" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Grievance Redressal
              </a>
            </div>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Policies</h3>
            <div className="space-y-4">
              <a href="#terms-policy" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Terms And Policy
              </a>
              <a href="#direct-sellers-agreement" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Direct Sellers Agreement
              </a>
              <a href="#terms-services" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Terms of Services
              </a>
              <a href="#shipping-policy" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Shipping Policy
              </a>
              <a href="#engineers-franchise" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                Engineers Franchise
              </a>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h6 className="block text-gray-300 hover:text-white font-semibold">
            Stay connected with us:
          </h6>

          <ul className="flex flex-wrap justify-center gap-x-6 ga-y-3 gap-4 mt-6">
            {/* Facebook */}
            <li>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-blue-600 w-8 h-8"
                  viewBox="0 0 49.652 49.652"
                >
                  <path d="M24.826 0C11.137 0 0 11.137 0 24.826c0 13.688 11.137 24.826 24.826 24.826 13.688 0 24.826-11.138 24.826-24.826C49.652 11.137 38.516 0 24.826 0zM31 25.7h-4.039v14.396h-5.985V25.7h-2.845v-5.088h2.845v-3.291c0-2.357 1.12-6.04 6.04-6.04l4.435.017v4.939h-3.219c-.524 0-1.269.262-1.269 1.386v2.99h4.56z" />
                </svg>
              </a>
            </li>

            {/* LinkedIn */}
            <li>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 112.196 112.196"
                >
                  <circle cx="56.098" cy="56.097" r="56.098" fill="#007ab9" />
                  <path
                    fill="#fff"
                    d="M89.616 60.611v23.128H76.207V62.161c0-5.418-1.936-9.118-6.791-9.118-3.705 0-5.906 2.491-6.878 4.903-.353.862-.444 2.059-.444 3.268v22.524h-13.41s.18-36.546 0-40.329h13.411v5.715c1.782-2.742 4.96-6.662 12.085-6.662 8.822 0 15.436 5.764 15.436 18.149zM34.656 23.969c-4.587 0-7.588 3.011-7.588 6.967 0 3.872 2.914 6.97 7.412 6.97h.087c4.677 0 7.585-3.098 7.585-6.97-.089-3.956-2.908-6.967-7.496-6.967zM27.865 83.739H41.27v-40.33H27.865v40.33z"
                  />
                </svg>
              </a>
            </li>

            {/* Instagram */}
            <li>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 152 152"
                >
                  <defs>
                    <linearGradient
                      id="a"
                      x1="22.26"
                      x2="129.74"
                      y1="22.26"
                      y2="129.74"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#fae100" />
                      <stop offset=".15" stopColor="#fcb720" />
                      <stop offset=".3" stopColor="#ff7950" />
                      <stop offset=".5" stopColor="#ff1c74" />
                      <stop offset="1" stopColor="#6c1cd1" />
                    </linearGradient>
                  </defs>
                  <g data-name="Layer 2">
                    <g data-name="03.Instagram">
                      <rect
                        width="152"
                        height="152"
                        fill="url(#a)"
                        rx="76"
                      />
                      <g fill="#fff">
                        <path
                          fill="#ffffff10"
                          d="M133.2 26c-11.08 20.34-26.75 41.32-46.33 60.9S46.31 122.12 26 133.2q-1.91-1.66-3.71-3.46A76 76 0 1 1 129.74 22.26q1.8 1.8 3.46 3.74z"
                        />
                        <path d="M94 36H58a22 22 0 0 0-22 22v36a22 22 0 0 0 22 22h36a22 22 0 0 0 22-22V58a22 22 0 0 0-22-22zm15 54.84A18.16 18.16 0 0 1 90.84 109H61.16A18.16 18.16 0 0 1 43 90.84V61.16A18.16 18.16 0 0 1 61.16 43h29.68A18.16 18.16 0 0 1 109 61.16z" />
                        <path d="m90.59 61.56-.19-.19-.16-.16A20.16 20.16 0 0 0 76 55.33 20.52 20.52 0 0 0 55.62 76a20.75 20.75 0 0 0 6 14.61 20.19 20.19 0 0 0 14.42 6 20.73 20.73 0 0 0 14.55-35.05zM76 89.56A13.56 13.56 0 1 1 89.37 76 13.46 13.46 0 0 1 76 89.56zm26.43-35.18a4.88 4.88 0 0 1-4.85 4.92 4.81 4.81 0 0 1-3.42-1.43 4.93 4.93 0 0 1 3.43-8.39 4.82 4.82 0 0 1 3.09 1.12l.1.1a3.05 3.05 0 0 1 .44.44l.11.12a4.92 4.92 0 0 1 1.1 3.12z" />
                      </g>
                    </g>
                  </g>
                </svg>
              </a>
            </li>

            {/* X (Twitter/X) */}
            <li>
              <a href="javascript:void(0)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 1227 1227"
                >
                  <path d="M613.5 0C274.685 0 0 274.685 0 613.5S274.685 1227 613.5 1227 1227 952.315 1227 613.5 952.315 0 613.5 0z" />
                  <path
                    fill="#fff"
                    d="m680.617 557.98 262.632-305.288h-62.235L652.97 517.77 470.833 252.692H260.759l275.427 400.844-275.427 320.142h62.239l240.82-279.931 192.35 279.931h210.074L680.601 557.98zM345.423 299.545h95.595l440.024 629.411h-95.595z"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400 font-medium">© 2025 Engineers Ecom Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Customer Dashboard Component
function CustomerDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [kycData, setKycData] = useState({
    pan: '',
    aadhaar: '',
    address: '',
    panPhoto: null,
    aadhaarPhoto: null
  });
  const [bankData, setBankData] = useState({
    accountNumber: '',
    ifsc: '',
    bankName: '',
    accountHolder: '',
    passbookPhoto: null
  });
  const [franchiseA, setFranchiseA] = useState(null);
  const [franchiseB, setFranchiseB] = useState(null);
  const [hierarchy, setHierarchy] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});
  
  // E-Wallet related states
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  
  // Income Wallet related states
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [showWithdrawalConfirmation, setShowWithdrawalConfirmation] = useState(false);
  const [currentWithdrawal, setCurrentWithdrawal] = useState(null);
  
  // Credit Wallet related states
  const [creditHistory, setCreditHistory] = useState([]);
  const [showCreditDetails, setShowCreditDetails] = useState(false);
  
  const companyDropdownRef = React.useRef(null);
  
  // Get user data from tree manager
  const userData = treeManager.getUserById(user.userId);
  
  // Generate referral link
  const referralLink = `${window.location.origin}?ref=${user.userId}`;
  
  // Financial data - in a real app, this would come from an API
  const [financialData, setFinancialData] = useState({
    directIncome: 0,
    indirectIncome: 0,
    incomeWallet: 0,
    eWallet: 0,  // Explicitly starting with 0
    creditWallet: 0,  // New credit wallet
    franchiseAPurchaseValue: 0,
    franchiseBPurchaseValue: 0,
    franchiseATurnover: 0,  // Track turnover for Franchise A
    franchiseBTurnover: 0   // Track turnover for Franchise B
  });
  
  // Calculate Reward Credits based on turnover
  const calculateRewardCredits = (turnover) => {
    let credits = 0;
    let remainingTurnover = turnover;
    
    // First slab: ₹0 to ₹200,000 = 10 credits
    if (remainingTurnover > 0) {
      const firstSlab = Math.min(remainingTurnover, 200000);
      if (firstSlab >= 200000) {
        credits += 10;
        remainingTurnover -= 200000;
      } else {
        return 0; // Not enough for first slab
      }
    }
    
    // Second slab: ₹200,001 to ₹700,000 = 15 credits
    if (remainingTurnover > 0) {
      const secondSlab = Math.min(remainingTurnover, 500000);
      if (secondSlab >= 500000) {
        credits += 15;
        remainingTurnover -= 500000;
      } else {
        return credits; // Return credits earned so far
      }
    }
    
    // Third slab: ₹700,001 to ₹1,700,000 = 20 credits
    if (remainingTurnover > 0) {
      const thirdSlab = Math.min(remainingTurnover, 1000000);
      if (thirdSlab >= 1000000) {
        credits += 20;
        remainingTurnover -= 1000000;
      } else {
        return credits; // Return credits earned so far
      }
    }
    
    // Fourth slab: Every additional ₹2,000,000 = 25 credits
    if (remainingTurnover > 0) {
      const fourthSlabCredits = Math.floor(remainingTurnover / 2000000) * 25;
      credits += fourthSlabCredits;
    }
    
    return credits;
  };
  
  // Calculate tax based on Indian tax rules
  const calculateTax = (amount) => {
    if (amount <= 10000) {
      return 0;
    } else if (amount > 10000 && amount <= 50000) {
      return amount * 0.05; // 5% tax
    } else if (amount > 50000 && amount <= 100000) {
      return amount * 0.10; // 10% tax
    } else {
      return amount * 0.15; // 15% tax
    }
  };
  
  // Handle withdrawal request
  const handleWithdrawalRequest = () => {
    const amount = parseFloat(withdrawalAmount);
    if (amount > 0 && amount <= financialData.incomeWallet) {
      const tax = calculateTax(amount);
      const creditedAmount = amount - tax;
      
      // Create withdrawal record
      const withdrawal = {
        id: 'WDR' + Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        amount: amount,
        tax: tax,
        creditedAmount: creditedAmount,
        status: 'Processing',
        expectedCreditDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 3 days from now
        expectedCreditTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleTimeString()
      };
      
      // Update withdrawal history
      setWithdrawalHistory([withdrawal, ...withdrawalHistory]);
      
      // Update income wallet balance
      setFinancialData(prev => ({
        ...prev,
        incomeWallet: prev.incomeWallet - amount
      }));
      
      // Update tree manager data
      treeManager.updateIncomeWalletBalance(user.userId, financialData.incomeWallet - amount);
      
      // Set current withdrawal for confirmation
      setCurrentWithdrawal(withdrawal);
      
      // Show confirmation screen
      setShowWithdrawalConfirmation(true);
      
      // Reset withdrawal amount
      setWithdrawalAmount('');
    }
  };
  
  // Handle withdrawal amount change
  const handleWithdrawalAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseFloat(value) > 0 && parseFloat(value) <= financialData.incomeWallet)) {
      setWithdrawalAmount(value);
    }
  };
  
  // Get expected credit timeline
  const getExpectedCreditTimeline = () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) return null;
    
    const expectedDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    return {
      day: expectedDate.toLocaleDateString('en-US', { weekday: 'long' }),
      date: expectedDate.toLocaleDateString(),
      time: expectedDate.toLocaleTimeString()
    };
  };
  
  // Load data when component mounts
  React.useEffect(() => {
    if (userData) {
      // Load KYC and bank data if available
      if (userData.kycVerified) {
        setKycData({
          pan: 'XXXXXX1234',
          aadhaar: 'XXXXXX5678',
          address: '123 Main Street, City, State',
          panPhoto: userData.kycData?.panPhoto || null,
          aadhaarPhoto: userData.kycData?.aadhaarPhoto || null
        });
      }
      
      if (userData.bankAccount) {
        setBankData({
          ...userData.bankAccount,
          passbookPhoto: userData.bankAccount.passbookPhoto || null
        });
      }
      
      // Load franchise data
      setFranchiseA(treeManager.getFranchiseA(user.userId));
      setFranchiseB(treeManager.getFranchiseB(user.userId));
      
      // Load hierarchy data
      setHierarchy(treeManager.getHierarchy(user.userId));
      
      // Load financial data
      const data = treeManager.getFinancialData(user.userId);
      if (data) {
        // Calculate franchise turnovers
        const franchiseATurnover = treeManager.calculateFranchiseTurnover(user.userId, 'A');
        const franchiseBTurnover = treeManager.calculateFranchiseTurnover(user.userId, 'B');
        
        // Calculate reward credits for each franchise
        const creditsFromA = calculateRewardCredits(franchiseATurnover);
        const creditsFromB = calculateRewardCredits(franchiseBTurnover);
        const totalCredits = creditsFromA + creditsFromB;
        
        setFinancialData({
          directIncome: data.directIncome || 0,
          indirectIncome: data.indirectIncome || 0,
          incomeWallet: data.incomeWallet || 0,
          eWallet: data.eWallet || 0,
          creditWallet: data.creditWallet || totalCredits,  // Initialize with calculated credits
          franchiseAPurchaseValue: data.franchiseAPurchaseValue || 0,
          franchiseBPurchaseValue: data.franchiseBPurchaseValue || 0,
          franchiseATurnover: franchiseATurnover,
          franchiseBTurnover: franchiseBTurnover
        });
        
        // Load credit history
        setCreditHistory(treeManager.getCreditHistory(user.userId) || []);
      }
    }
  }, [userData, user.userId]);
  
  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleKYCSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to a backend
    const result = treeManager.updateKYC(user.userId, kycData);
    if (result.success) {
      alert('KYC verification submitted successfully!');
      // Update user data
      const updatedUser = treeManager.getUserById(user.userId);
      if (updatedUser) {
        setHierarchy(treeManager.getHierarchy(user.userId));
      }
    } else {
      alert('Error submitting KYC verification');
    }
  };
  
  const handleBankSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to a backend
    const result = treeManager.addBankAccount(user.userId, bankData);
    if (result.success) {
      alert('Bank account added successfully!');
      // Update user data
      const updatedUser = treeManager.getUserById(user.userId);
      if (updatedUser) {
        setHierarchy(treeManager.getHierarchy(user.userId));
      }
    } else {
      alert('Error adding bank account');
    }
  };
  
  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (fileType === 'panPhoto') {
          setKycData({...kycData, panPhoto: reader.result});
        } else if (fileType === 'aadhaarPhoto') {
          setKycData({...kycData, aadhaarPhoto: reader.result});
        } else if (fileType === 'passbookPhoto') {
          setBankData({...bankData, passbookPhoto: reader.result});
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const toggleNodeExpansion = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const handleSwitchToPortal = () => {
    // This will be handled by the parent component
    window.switchToManagePortal(user);
  };
  
  // E-Wallet functions
  const handleAddMoney = () => {
    if (paymentAmount >= 10 && paymentAmount <= 50000) {
      setShowPaymentGateway(true);
    } else {
      alert('Please enter an amount between ₹10 and ₹50,000');
    }
  };
  
  const processPayment = () => {
    // In a real app, this would integrate with a payment gateway
    // For demo purposes, we'll simulate a successful payment
    setTimeout(() => {
      const newTransactionId = 'TXN' + Math.floor(Math.random() * 1000000);
      setTransactionId(newTransactionId);
      
      // Update the eWallet balance
      setFinancialData(prev => ({
        ...prev,
        eWallet: prev.eWallet + parseFloat(paymentAmount)
      }));
      
      // Update the tree manager data
      treeManager.updateEWalletBalance(user.userId, financialData.eWallet + parseFloat(paymentAmount));
      
      // Show success message
      setShowPaymentGateway(false);
      setPaymentSuccess(true);
      setPaymentAmount('');
      
      // Hide success message after 5 seconds
      setTimeout(() => setPaymentSuccess(false), 5000);
    }, 2000);
  };
  
  const renderPaymentGateway = () => {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Complete Payment</h3>
            <button 
              onClick={() => setShowPaymentGateway(false)}
              className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">Amount to Pay</div>
            <div className="text-2xl font-bold">₹{paymentAmount}</div>
          </div>
          
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-2">Payment Method</div>
            <div className="bg-gray-100 p-3 rounded-md">
              <div className="flex items-center">
                {paymentMethod === 'upi' && <div className=" mr-3"></div>}
                {paymentMethod === 'card' && <div className=" mr-3"></div>}
                {paymentMethod === 'netbanking' && <div className=" mr-3"></div>}
                <div className="font-medium capitalize">{paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Net Banking'}</div>
              </div>
            </div>
          </div>
          
          <div className="mb-4 p-3 bg-yellow-50 rounded-md">
            <div className="text-sm text-yellow-800">
              This is a demo payment gateway. In a real application, this would connect to an actual payment service provider.
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowPaymentGateway(false)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              onClick={processPayment}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderAddMoneyModal = () => {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add Money to E-Wallet</h3>
            <button 
              onClick={() => setShowAddMoneyModal(false)}
              className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Amount (₹)</label>
            <input 
              type="number" 
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount between ₹10 to ₹50,000"
              min="10"
              max="50000"
            />
            <div className="text-xs text-gray-500 mt-1">Minimum: ₹10, Maximum: ₹50,000</div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Payment Method</label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="mr-3"
                />
                <div>UPI</div>
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mr-3"
                />
                <div>Credit/Debit Card</div>
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="netbanking"
                  checked={paymentMethod === 'netbanking'}
                  onChange={() => setPaymentMethod('netbanking')}
                  className="mr-3"
                />
                <div>Net Banking</div>
              </label>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowAddMoneyModal(false)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddMoney}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Money
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderHierarchyNode = (node, level = 0) => {
    const isExpanded = expandedNodes[node.id] || false;
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className="ml-4">
        <div className="flex items-center mb-2">
          <div className="flex items-center p-2 border rounded-lg bg-white shadow-sm">
            {hasChildren && (
              <button 
                onClick={() => toggleNodeExpansion(node.id)}
                className="mr-2 text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            <div>
              <div className="font-medium">{node.name}</div>
              <div className="text-sm text-gray-500">ID: {node.id}</div>
              <div className="text-xs">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  node.kycVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {node.kycVerified ? 'KYC Verified' : 'KYC Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div className="ml-4 border-l-2 border-gray-200 pl-4">
            {node.children.map(child => renderHierarchyNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Entrepreneur Dashboard</h2>
            
            {/* Financial Overview */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">Total Payout</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{financialData.directIncome + financialData.indirectIncome}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Direct: ₹{financialData.directIncome} | Indirect: ₹{financialData.indirectIncome}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">Income Wallet</div>
                  <div className="text-2xl font-bold text-green-600">
                    ₹{financialData.incomeWallet}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Available for withdrawal</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">E-Wallet</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{financialData.eWallet}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Available for purchases</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">Credit Wallet</div>
                  <div className="text-2xl font-bold text-purple-600">
                    ₹{financialData.creditWallet}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Reward Credits earned</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">Total Purchase Value</div>
                  <div className="text-lg font-bold text-orange-600">
                    Franchise A: ₹{financialData.franchiseAPurchaseValue}
                  </div>
                  <div className="text-lg font-bold text-orange-600">
                    Franchise B: ₹{financialData.franchiseBPurchaseValue}
                  </div>
                </div>
              </div>
            </div>
            
            {/* User Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">KYC Status</label>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userData?.kycVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userData?.kycVerified ? 'Verified' : 'Not Verified'}
                  </span>
                  {!userData?.kycVerified && (
                    <button 
                      onClick={() => setActiveTab('kyc')}
                      className="ml-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Verify Now
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account</label>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userData?.bankAccount 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userData?.bankAccount ? 'Added' : 'Not Added'}
                  </span>
                  {!userData?.bankAccount && (
                    <button 
                      onClick={() => setActiveTab('bank')}
                      className="ml-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Add Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'ewallet':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">E-Wallet</h2>
            
            {/* Success Message */}
            {paymentSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <Check className="text-green-600 mr-2" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Payment Successful!</h3>
                    <p className="text-green-700">₹{paymentAmount} has been added to your E-Wallet.</p>
                    <p className="text-green-700 text-sm">Transaction ID: {transactionId}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Wallet Balance Card - Changed to blue theme like financial overview */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Available Balance</div>
                    <div className="text-3xl font-bold text-blue-600">₹{financialData.eWallet}</div>
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <Wallet size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Add Money Button - Changed to blue theme */}
            <button 
              onClick={() => setShowAddMoneyModal(true)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
            >
              <Plus size={20} className="mr-2" />
              Add Money
            </button>
            
            {/* Transaction History */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentSuccess ? (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date().toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transactionId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Wallet Top-up
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          +₹{paymentAmount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Success
                          </span>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'incomewallet':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Income Wallet</h2>
            
            {/* Withdrawal Confirmation Modal */}
            {showWithdrawalConfirmation && currentWithdrawal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg w-full max-w-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Withdrawal Request Initiated</h3>
                    <button 
                      onClick={() => setShowWithdrawalConfirmation(false)}
                      className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="mb-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Check className="text-green-600 mr-2" size={24} />
                      <h3 className="text-lg font-semibold text-green-800">Request Successful!</h3>
                    </div>
                    <p className="text-green-700">Your withdrawal request has been initiated successfully.</p>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Request ID:</span>
                      <span className="font-medium">{currentWithdrawal.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Withdrawal Amount:</span>
                      <span className="font-medium">₹{currentWithdrawal.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax Deducted:</span>
                      <span className="font-medium">₹{currentWithdrawal.tax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credited Amount:</span>
                      <span className="font-medium text-green-600">₹{currentWithdrawal.creditedAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Credit Date:</span>
                      <span className="font-medium">{currentWithdrawal.expectedCreditDate}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 rounded-md mb-4">
                    <p className="text-sm text-yellow-800">
                      The amount will be credited to your bank account within 3 business days.
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => setShowWithdrawalConfirmation(false)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
            
            {/* Wallet Balance Card */}
            <div className="mb-8 p-4 bg-green-50 rounded-lg">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Available Balance</div>
                    <div className="text-3xl font-bold text-green-600">₹{financialData.incomeWallet}</div>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <Wallet size={24} className="text-green-600" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Withdrawal Form */}
            <div className="mb-8 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Request Withdrawal</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter Amount (₹)</label>
                <input 
                  type="number" 
                  value={withdrawalAmount}
                  onChange={handleWithdrawalAmountChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter amount to withdraw"
                  min="1"
                  max={financialData.incomeWallet}
                />
                {withdrawalAmount && parseFloat(withdrawalAmount) > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    Tax: ₹{calculateTax(parseFloat(withdrawalAmount))} | 
                    Credited Amount: ₹{(parseFloat(withdrawalAmount) - calculateTax(parseFloat(withdrawalAmount))).toFixed(2)}
                  </div>
                )}
              </div>
              
              {/* Expected Credit Timeline */}
              {withdrawalAmount && parseFloat(withdrawalAmount) > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-md">
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Expected Credit Timeline:</p>
                    <p>{getExpectedCreditTimeline()?.day}, {getExpectedCreditTimeline()?.date} at {getExpectedCreditTimeline()?.time}</p>
                  </div>
                </div>
              )}
              
              <button 
                onClick={handleWithdrawalRequest}
                disabled={!withdrawalAmount || parseFloat(withdrawalAmount) <= 0 || parseFloat(withdrawalAmount) > financialData.incomeWallet}
                className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  withdrawalAmount && parseFloat(withdrawalAmount) > 0 && parseFloat(withdrawalAmount) <= financialData.incomeWallet
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Proceed with Withdrawal
              </button>
            </div>
            
            {/* Tax Information */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Tax Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Up to ₹10,000:</span>
                  <span className="font-medium">No Tax</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">₹10,001 to ₹50,000:</span>
                  <span className="font-medium">5% Tax</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">₹50,001 to ₹100,000:</span>
                  <span className="font-medium">10% Tax</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Above ₹100,000:</span>
                  <span className="font-medium">15% Tax</span>
                </div>
              </div>
            </div>
            
            {/* Transaction History */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Withdrawal History</h3>
              {withdrawalHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Request ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tax Deducted
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Credited Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {withdrawalHistory.map((withdrawal) => (
                        <tr key={withdrawal.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {withdrawal.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {withdrawal.date} {withdrawal.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{withdrawal.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{withdrawal.tax}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            ₹{withdrawal.creditedAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              withdrawal.status === 'Completed' 
                                ? 'bg-green-100 text-green-800' 
                                : withdrawal.status === 'Processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {withdrawal.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-center text-gray-500">No withdrawal history found</p>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'creditwallet':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Credit Wallet</h2>
            
            {/* Credit Wallet Balance Card */}
            <div className="mb-8 p-4 bg-purple-50 rounded-lg">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Available Credits</div>
                    <div className="text-3xl font-bold text-purple-600">{financialData.creditWallet}</div>
                    <div className="text-xs text-gray-500 mt-1">Reward Credits earned from franchise performance</div>
                  </div>
                  <div className="bg-purple-100 rounded-full p-3">
                    <Award size={24} className="text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Franchise Performance */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Franchise A (Left Side)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Turnover:</span>
                    <span className="font-medium">₹{financialData.franchiseATurnover.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credits Earned:</span>
                    <span className="font-medium">{calculateRewardCredits(financialData.franchiseATurnover)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Threshold:</span>
                    <span className="font-medium">
                      {financialData.franchiseATurnover < 200000 
                        ? `₹${(200000 - financialData.franchiseATurnover).toLocaleString()} to reach 10 credits`
                        : financialData.franchiseATurnover < 700000
                        ? `₹${(700000 - financialData.franchiseATurnover).toLocaleString()} to reach 25 credits`
                        : financialData.franchiseATurnover < 1700000
                        ? `₹${(1700000 - financialData.franchiseATurnover).toLocaleString()} to reach 45 credits`
                        : `₹${(Math.ceil(financialData.franchiseATurnover / 2000000) * 2000000 - financialData.franchiseATurnover).toLocaleString()} to reach next level`
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Franchise B (Right Side)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Turnover:</span>
                    <span className="font-medium">₹{financialData.franchiseBTurnover.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credits Earned:</span>
                    <span className="font-medium">{calculateRewardCredits(financialData.franchiseBTurnover)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Threshold:</span>
                    <span className="font-medium">
                      {financialData.franchiseBTurnover < 200000 
                        ? `₹${(200000 - financialData.franchiseBTurnover).toLocaleString()} to reach 10 credits`
                        : financialData.franchiseBTurnover < 700000
                        ? `₹${(700000 - financialData.franchiseBTurnover).toLocaleString()} to reach 25 credits`
                        : financialData.franchiseBTurnover < 1700000
                        ? `₹${(1700000 - financialData.franchiseBTurnover).toLocaleString()} to reach 45 credits`
                        : `₹${(Math.ceil(financialData.franchiseBTurnover / 2000000) * 2000000 - financialData.franchiseBTurnover).toLocaleString()} to reach next level`
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Reward Structure Information */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Reward Structure</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">First ₹200,000 turnover:</span>
                  <span className="font-medium">10 Reward Credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next ₹500,000 turnover:</span>
                  <span className="font-medium">15 Reward Credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next ₹1,000,000 turnover:</span>
                  <span className="font-medium">20 Reward Credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Every additional ₹2,000,000:</span>
                  <span className="font-medium">25 Reward Credits</span>
                </div>
              </div>
            </div>
            
            {/* Credit History */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Credit History</h3>
                <button 
                  onClick={() => setShowCreditDetails(!showCreditDetails)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {showCreditDetails ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              
              {creditHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Franchise
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Turnover
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Credits Earned
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Credits
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {creditHistory.map((credit, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {credit.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {credit.franchise}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{credit.turnover.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                            +{credit.creditsEarned}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                            {credit.totalCredits}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-center text-gray-500">No credit history found</p>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'franchiseA':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Franchise A (Left Team)</h2>
            {franchiseA ? (
              <div>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Current Turnover</div>
                      <div className="text-xl font-bold text-blue-600">₹{financialData.franchiseATurnover.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Credits Earned</div>
                      <div className="text-xl font-bold text-purple-600">{calculateRewardCredits(financialData.franchiseATurnover)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Next Threshold</div>
                      <div className="text-sm font-medium">
                        {financialData.franchiseATurnover < 200000 
                          ? `₹${(200000 - financialData.franchiseATurnover).toLocaleString()}`
                          : financialData.franchiseATurnover < 700000
                          ? `₹${(700000 - financialData.franchiseATurnover).toLocaleString()}`
                          : financialData.franchiseATurnover < 1700000
                          ? `₹${(1700000 - financialData.franchiseATurnover).toLocaleString()}`
                          : `₹${(Math.ceil(financialData.franchiseATurnover / 2000000) * 2000000 - financialData.franchiseATurnover).toLocaleString()}`
                        }
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          S.No
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date of Joining
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          KYC Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Purchase Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {franchiseA.direct ? (
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchiseA.direct.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchiseA.direct.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchiseA.direct.joinDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              franchiseA.direct.kycVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {franchiseA.direct.kycVerified ? 'Verified' : 'Not Verified'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{franchiseA.direct.purchaseValue || 0}</td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            No direct referral in Franchise A
                          </td>
                        </tr>
                      )}
                      {franchiseA.grandchildren.map((child, index) => (
                        <tr key={child.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 2}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.joinDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              child.kycVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {child.kycVerified ? 'Verified' : 'Not Verified'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{child.purchaseValue || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-center text-gray-500">No data available for Franchise A</p>
              </div>
            )}
          </div>
        );
        
      case 'franchiseB':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Franchise B (Right Team)</h2>
            {franchiseB ? (
              <div>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Current Turnover</div>
                      <div className="text-xl font-bold text-blue-600">₹{financialData.franchiseBTurnover.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Credits Earned</div>
                      <div className="text-xl font-bold text-purple-600">{calculateRewardCredits(financialData.franchiseBTurnover)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Next Threshold</div>
                      <div className="text-sm font-medium">
                        {financialData.franchiseBTurnover < 200000 
                          ? `₹${(200000 - financialData.franchiseBTurnover).toLocaleString()}`
                          : financialData.franchiseBTurnover < 700000
                          ? `₹${(700000 - financialData.franchiseBTurnover).toLocaleString()}`
                          : financialData.franchiseBTurnover < 1700000
                          ? `₹${(1700000 - financialData.franchiseBTurnover).toLocaleString()}`
                          : `₹${(Math.ceil(financialData.franchiseBTurnover / 2000000) * 2000000 - financialData.franchiseBTurnover).toLocaleString()}`
                        }
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          S.No
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date of Joining
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          KYC Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Purchase Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {franchiseB.direct ? (
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchiseB.direct.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchiseB.direct.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchiseB.direct.joinDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              franchiseB.direct.kycVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {franchiseB.direct.kycVerified ? 'Verified' : 'Not Verified'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{franchiseB.direct.purchaseValue || 0}</td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            No direct referral in Franchise B
                          </td>
                        </tr>
                      )}
                      {franchiseB.grandchildren.map((child, index) => (
                        <tr key={child.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 2}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.joinDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              child.kycVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {child.kycVerified ? 'Verified' : 'Not Verified'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{child.purchaseValue || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-center text-gray-500">No data available for Franchise B</p>
              </div>
            )}
          </div>
        );
        
      case 'kyc':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">KYC Verification</h2>
            {userData?.kycVerified ? (
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center">
                  <Check className="text-green-600 mr-2" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">KYC Verified</h3>
                    <p className="text-green-700">Your KYC has been successfully verified.</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleKYCSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                    <input 
                      type="text" 
                      value={kycData.pan}
                      onChange={(e) => setKycData({...kycData, pan: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your PAN number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card Photo</label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="file" 
                        id="pan-photo"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'panPhoto')}
                        className="hidden"
                      />
                      <label 
                        htmlFor="pan-photo"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
                      >
                        Choose File
                      </label>
                      {kycData.panPhoto && (
                        <div className="flex items-center">
                          <span className="text-sm text-green-600">Photo uploaded</span>
                          <button 
                            type="button"
                            onClick={() => setKycData({...kycData, panPhoto: null})}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
                    <input 
                      type="text" 
                      value={kycData.aadhaar}
                      onChange={(e) => setKycData({...kycData, aadhaar: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your Aadhaar number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Card Photo</label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="file" 
                        id="aadhaar-photo"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'aadhaarPhoto')}
                        className="hidden"
                      />
                      <label 
                        htmlFor="aadhaar-photo"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
                      >
                        Choose File
                      </label>
                      {kycData.aadhaarPhoto && (
                        <div className="flex items-center">
                          <span className="text-sm text-green-600">Photo uploaded</span>
                          <button 
                            type="button"
                            onClick={() => setKycData({...kycData, aadhaarPhoto: null})}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea 
                      value={kycData.address}
                      onChange={(e) => setKycData({...kycData, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Enter your address"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="kyc-terms"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      required
                    />
                    <label htmlFor="kyc-terms" className="ml-2 text-sm text-gray-700">
                      I agree to the terms and conditions for KYC verification
                    </label>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Submit KYC Verification
                  </button>
                </div>
              </form>
            )}
          </div>
        );
        
      case 'bank':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Bank Account</h2>
            {userData?.bankAccount ? (
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center">
                  <Check className="text-green-600 mr-2" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Bank Account Added</h3>
                    <p className="text-green-700">Your bank account has been successfully added.</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Account Number:</span>
                    <p className="font-medium">XXXXXX{userData.bankAccount.accountNumber.slice(-4)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">IFSC Code:</span>
                    <p className="font-medium">{userData.bankAccount.ifsc}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Bank Name:</span>
                    <p className="font-medium">{userData.bankAccount.bankName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Account Holder:</span>
                    <p className="font-medium">{userData.bankAccount.accountHolder}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBankSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                    <input 
                      type="text" 
                      value={bankData.accountNumber}
                      onChange={(e) => setBankData({...bankData, accountNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your account number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                    <input 
                      type="text" 
                      value={bankData.ifsc}
                      onChange={(e) => setBankData({...bankData, ifsc: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your IFSC code"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                    <input 
                      type="text" 
                      value={bankData.bankName}
                      onChange={(e) => setBankData({...bankData, bankName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your bank name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                    <input 
                      type="text" 
                      value={bankData.accountHolder}
                      onChange={(e) => setBankData({...bankData, accountHolder: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter account holder name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Passbook Photo</label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="file" 
                        id="passbook-photo"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'passbookPhoto')}
                        className="hidden"
                      />
                      <label 
                        htmlFor="passbook-photo"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
                      >
                        Choose File
                      </label>
                      {bankData.passbookPhoto && (
                        <div className="flex items-center">
                          <span className="text-sm text-green-600">Photo uploaded</span>
                          <button 
                            type="button"
                            onClick={() => setBankData({...bankData, passbookPhoto: null})}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="bank-terms"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      required
                    />
                    <label htmlFor="bank-terms" className="ml-2 text-sm text-gray-700">
                      I agree to the terms and conditions for adding bank account
                    </label>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Add Bank Account
                  </button>
                </div>
              </form>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <CartContext.Provider value={{ cartItems: [], wishlistItems: [] }}>
        <Header 
          user={user}
          onLogout={onLogout}
          onProfileClick={() => setShowProfileModal(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isCompanyDropdownOpen={isCompanyDropdownOpen}
          setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
          companyDropdownRef={companyDropdownRef}
          setCurrentPage={() => {}}
          setShowAuth={() => {}}
          showSecondaryHeader={true}
          secondaryTitle="Customer Dashboard"
          onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
          onPortalClick={handleSwitchToPortal} // This now switches to manage portal
        />
      </CartContext.Provider>
      
      {/* Dashboard Header with Menu */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-1xl text-gray-600">
                  Welcome, <span className="font-semibold">{user.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Side Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative flex flex-col w-64 bg-white h-full shadow-xl">
            <div className="flex items-center justify-between p-4">
              <div className="text-lg font-semibold">Menu</div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <button
                onClick={() => {
                  setActiveTab('profile');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'profile' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab('franchiseA');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'franchiseA' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Franchise A
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('franchiseB');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'franchiseB' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Franchise B
              </button>
              <button
                onClick={() => {
                  setActiveTab('ewallet');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'ewallet' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                E-Wallet
              </button>
              <button
                onClick={() => {
                  setActiveTab('incomewallet');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'incomewallet' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Income Wallet
              </button>
              <button
                onClick={() => {
                  setActiveTab('kyc');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'kyc' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                KYC Verification
              </button>
              <button
                onClick={() => {
                  setActiveTab('bank');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'bank' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Add Bank Account
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 py-8">
        {renderTabContent()}
      </div>
      
      {/* Modals */}
      {showAddMoneyModal && renderAddMoneyModal()}
      {showPaymentGateway && renderPaymentGateway()}
      
      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Profile Information</h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">User Name</label>
                <p className="text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">User ID</label>
                <p className="text-gray-900">{user.userId}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Referral Link</label>
                <div className="flex items-center">
                  <input 
                    type="text" 
                    value={referralLink} 
                    readOnly 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                  <button 
                    onClick={handleCopyReferralLink}
                    className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

// Brand Owner Dashboard Component
function BrandOwnerDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTeamPortal, setShowTeamPortal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [kycData, setKycData] = useState({
    pan: '',
    aadhaar: '',
    address: '',
    panPhoto: null,
    aadhaarPhoto: null
  });
  const [bankData, setBankData] = useState({
    accountNumber: '',
    ifsc: '',
    bankName: '',
    accountHolder: '',
    passbookPhoto: null
  });
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockUpdateType, setStockUpdateType] = useState('add');
  const [variantTab, setVariantTab] = useState('stock');
  const [productForm, setProductForm] = useState({
    name: '',
    brandName: '',
    price: '',
    discountedPrice: '',
    offer: '',
    category: '',
    subCategory: '',
    stockQuantity: '',
    sku: '',
    hsnCode: '',
    fitType: '',
    type: '',
    sizes: '',
    colors: '',
    material: '',
    pattern: '',
    neckType: '',
    sleeveType: '',
    occasion: '',
    length: '',
    closureType: '',
    stretchability: '',
    shortDescription: '',
    fullDescription: '',
    keyFeatures: '',
    washMethod: '',
    ironingDetails: '',
    images: [],
    videoLink: '',
    instagramLink: '',
    packageDimensions: '',
    weight: '',
    deliveryAvailability: '',
    codOption: '',
    sellerAddress: '',
    returnPolicy: '',
    gstPercentage: '',
    manufacturerDetails: '',
    countryOfOrigin: '',
    credits: ''
  });
  const [accessories, setAccessories] = useState([]);
  const [editingAccessory, setEditingAccessory] = useState(null);
  const [accessoryForm, setAccessoryForm] = useState({
    name: '',
    brandName: '',
    price: '',
    discountedPrice: '',
    offer: '',
    category: '',
    subCategory: '',
    stockQuantity: '',
    sku: '',
    hsnCode: '',
    // Accessory-specific fields
    accessoryType: '',
    material: '',
    color: '',
    size: '',
    dimensions: '',
    weight: '',
    // Common fields
    shortDescription: '',
    fullDescription: '',
    keyFeatures: '',
    careInstructions: '',
    images: [],
    videoLink: '',
    instagramLink: '',
    packageDimensions: '',
    weight: '',
    deliveryAvailability: '',
    codOption: '',
    sellerAddress: '',
    returnPolicy: '',
    gstPercentage: '',
    manufacturerDetails: '',
    countryOfOrigin: '',
    // Additional accessory-specific fields
    warranty: '',
    authenticityCertificate: null,
    specialFeatures: '',
    credits: ''
  });

  // E-Wallet related states
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  
  // Income Wallet related states
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [showWithdrawalConfirmation, setShowWithdrawalConfirmation] = useState(false);
  const [currentWithdrawal, setCurrentWithdrawal] = useState(null);
  
  // Team member related states
  const [teamMembers, setTeamMembers] = useState([]);
  const [showAddTeamMemberForm, setShowAddTeamMemberForm] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    email: '',
    role: 'Standard Member',
    isActive: true
  });
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  
  // Add these state variables
  const [showBulkOperations, setShowBulkOperations] = useState(false);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);
  
  const companyDropdownRef = React.useRef(null);
  
  // Get user data from tree manager
  const userData = treeManager.getUserById(user.userId);
  
  // Generate referral link
  const referralLink = `${window.location.origin}?ref=${user.userId}`;
  
  useEffect(() => {
    const savedMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');
    setTeamMembers(savedMembers);
  }, []);

  // Add these functions
  const handleDuplicateProduct = (product) => {
    const duplicatedProduct = {
      ...product,
      id: Date.now().toString(),
      name: `${product.name} (Copy)`,
      status: 'draft',
      stockQuantity: 0,
      skuCodes: product.skuCodes ? product.skuCodes.map(sku => ({...sku, stock: 0})) : [],
      lastUpdated: new Date().toISOString(),
      lastSynced: null
    };
    
    setProducts([...products, duplicatedProduct]);
    alert('Product duplicated successfully!');
  };

  const checkLowStockAlerts = () => {
    const alerts = products
      .filter(product => (product.stockQuantity || 0) < (product.lowStockThreshold || 10))
      .map(product => ({
        id: product.id,
        name: product.name,
        currentStock: product.stockQuantity || 0,
        threshold: product.lowStockThreshold || 10
      }));
      
    setLowStockAlerts(alerts);
    
    if (alerts.length > 0) {
      alert(`${alerts.length} products are running low on stock!`);
    }
  };

  // Call this function when the component mounts or when products change
  useEffect(() => {
    checkLowStockAlerts();
  }, [products]);

  const handleSaveTeamMember = () => {
    if (newTeamMember.name && newTeamMember.email) {
      const updatedMembers = [...teamMembers, { ...newTeamMember, id: Date.now(), isActive: true }];
      setTeamMembers(updatedMembers);
      localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
      
      setNewTeamMember({
        name: '',
        email: '',
        role: 'Standard Member'
      });
      
      setActiveTab('team');
    }
  };

  const handleEditTeamMember = (member) => {
    setEditingTeamMember(member);
    setActiveTab('editTeamMember');
  };

  const handleUpdateTeamMember = () => {
    if (editingTeamMember) {
      const updatedMembers = teamMembers.map(member => 
        member.id === editingTeamMember.id ? editingTeamMember : member
      );
      setTeamMembers(updatedMembers);
      localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
      
      setEditingTeamMember(null);
      setActiveTab('team');
    }
  };

  const handleToggleTeamMemberStatus = (id) => {
    const updatedMembers = teamMembers.map(member => 
      member.id === id ? { ...member, isActive: !member.isActive } : member
    );
    setTeamMembers(updatedMembers);
    localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
    setActionMenuOpen(null);
  };

  const handleDeleteTeamMember = (id) => {
    const member = teamMembers.find(m => m.id === id);
    if (member) {
      setMemberToDelete(member);
      setShowDeleteConfirmation(true);
    }
  };

  const confirmDeleteTeamMember = () => {
    if (memberToDelete) {
      const updatedMembers = teamMembers.filter(member => member.id !== memberToDelete.id);
      setTeamMembers(updatedMembers);
      localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
      
      setMemberToDelete(null);
      setShowDeleteConfirmation(false);
      setActionMenuOpen(null);
    }
  };
  
  // Financial data - in a real app, this would come from an API
  const [financialData, setFinancialData] = useState({
    directIncome: 0,
    indirectIncome: 0,
    incomeWallet: 0,
    eWallet: 0,  // Starting with 0 as requested
    totalPayout: 0
  });
  
  // Calculate tax based on Indian tax rules
  const calculateTax = (amount) => {
    if (amount <= 10000) {
      return 0;
    } else if (amount > 10000 && amount <= 50000) {
      return amount * 0.05; // 5% tax
    } else if (amount > 50000 && amount <= 100000) {
      return amount * 0.10; // 10% tax
    } else {
      return amount * 0.15; // 15% tax
    }
  };
  
  // Handle withdrawal request
  const handleWithdrawalRequest = () => {
    const amount = parseFloat(withdrawalAmount);
    if (amount > 0 && amount <= financialData.incomeWallet) {
      const tax = calculateTax(amount);
      const creditedAmount = amount - tax;
      
      // Create withdrawal record
      const withdrawal = {
        id: 'WDR' + Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        amount: amount,
        tax: tax,
        creditedAmount: creditedAmount,
        status: 'Processing',
        expectedCreditDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 3 days from now
        expectedCreditTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleTimeString()
      };
      
      // Update withdrawal history
      setWithdrawalHistory([withdrawal, ...withdrawalHistory]);
      
      // Update income wallet balance
      setFinancialData(prev => ({
        ...prev,
        incomeWallet: prev.incomeWallet - amount
      }));
      
      // Update tree manager data
      treeManager.updateIncomeWalletBalance(user.userId, financialData.incomeWallet - amount);
      
      // Set current withdrawal for confirmation
      setCurrentWithdrawal(withdrawal);
      
      // Show confirmation screen
      setShowWithdrawalConfirmation(true);
      
      // Reset withdrawal amount
      setWithdrawalAmount('');
    }
  };
  
  // Handle withdrawal amount change
  const handleWithdrawalAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseFloat(value) > 0 && parseFloat(value) <= financialData.incomeWallet)) {
      setWithdrawalAmount(value);
    }
  };
  
  // Get expected credit timeline
  const getExpectedCreditTimeline = () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) return null;
    
    const expectedDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    return {
      day: expectedDate.toLocaleDateString('en-US', { weekday: 'long' }),
      date: expectedDate.toLocaleDateString(),
      time: expectedDate.toLocaleTimeString()
    };
  };
  
  // Load data when component mounts
  React.useEffect(() => {
    if (userData) {
      // Load KYC and bank data if available
      if (userData.kycVerified) {
        setKycData({
          pan: 'XXXXXX1234',
          aadhaar: 'XXXXXX5678',
          address: '123 Main Street, City, State',
          panPhoto: userData.kycData?.panPhoto || null,
          aadhaarPhoto: userData.kycData?.aadhaarPhoto || null
        });
      }
      
      if (userData.bankAccount) {
        setBankData({
          ...userData.bankAccount,
          passbookPhoto: userData.bankAccount.passbookPhoto || null
        });
      }
      
      // Load products
      setProducts(treeManager.getProducts(user.userId));
      
      // Load financial data but ensure eWallet is always 0 initially
      const data = treeManager.getFinancialData(user.userId);
      if (data) {
        setFinancialData({
          directIncome: data.directIncome || 0,
          indirectIncome: data.indirectIncome || 0,
          incomeWallet: data.incomeWallet || 0,
          eWallet: 0,  // Force eWallet to be 0 on initial load
          totalPayout: data.totalPayout || 0
        });
      }
      
      // Load withdrawal history if available
      if (userData.withdrawalHistory) {
        setWithdrawalHistory(userData.withdrawalHistory);
      }
    }
  }, [userData, user.userId]);
  
  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleKYCSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to a backend
    const result = treeManager.updateKYC(user.userId, kycData);
    if (result.success) {
      alert('KYC verification submitted successfully!');
      // Update user data
      const updatedUser = treeManager.getUserById(user.userId);
      if (updatedUser) {
        // Update state with real data
        setKycData({
          pan: 'XXXXXX1234',
          aadhaar: 'XXXXXX5678',
          address: kycData.address,
          panPhoto: kycData.panPhoto,
          aadhaarPhoto: kycData.aadhaarPhoto
        });
      }
    } else {
      alert('Error submitting KYC verification');
    }
  };
  
  const handleBankSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to a backend
    const result = treeManager.addBankAccount(user.userId, bankData);
    if (result.success) {
      alert('Bank account added successfully!');
      // Update user data
      const updatedUser = treeManager.getUserById(user.userId);
      if (updatedUser) {
        setBankData({
          ...bankData,
          passbookPhoto: bankData.passbookPhoto
        });
      }
    } else {
      alert('Error adding bank account');
    }
  };
  
  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (fileType === 'panPhoto') {
          setKycData({...kycData, panPhoto: reader.result});
        } else if (fileType === 'aadhaarPhoto') {
          setKycData({...kycData, aadhaarPhoto: reader.result});
        } else if (fileType === 'passbookPhoto') {
          setBankData({...bankData, passbookPhoto: reader.result});
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleProductImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(readers).then(images => {
      setProductForm({
        ...productForm,
        images: [...productForm.images, ...images]
      });
    });
  };
  
  const removeProductImage = (index) => {
    setProductForm({
      ...productForm,
      images: productForm.images.filter((_, i) => i !== index)
    });
  };
  
  const handleProductSubmit = (e) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Update existing product - REAL TIME UPDATE
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { ...productForm, id: editingProduct.id }
          : p
      );
      setProducts(updatedProducts);
      
      // Update in treeManager
      treeManager.updateProduct(user.userId, { ...productForm, id: editingProduct.id });
      
      alert('Product updated successfully!');
    } else {
      // Add new product - REAL TIME UPDATE
      const newProduct = {
        ...productForm,
        id: Date.now().toString()
      };
      setProducts([...products, newProduct]);
      
      // Save to treeManager
      treeManager.addProduct(user.userId, newProduct);
      
      alert('Product added successfully!');
    }
    
    // Reset form and go back to products list
    resetProductForm();
    setActiveTab('products');
  };
  
  const resetProductForm = () => {
    setProductForm({
      name: '',
      brandName: '',
      price: '',
      discountedPrice: '',
      offer: '',
      category: '',
      subCategory: '',
      stockQuantity: '',
      sku: '',
      hsnCode: '',
      fitType: '',
      type: '',
      colors: '',
      sizes: '',
      material: '',
      pattern: '',
      neckType: '',
      sleeveType: '',
      occasion: '',
      length: '',
      closureType: '',
      stretchability: '',
      shortDescription: '',
      fullDescription: '',
      keyFeatures: '',
      washMethod: '',
      ironingDetails: '',
      images: [],
      videoLink: '',
      instagramLink: '',
      packageDimensions: '',
      weight: '',
      deliveryAvailability: '',
      codOption: '',
      sellerAddress: '',
      returnPolicy: '',
      gstPercentage: '',
      manufacturerDetails: '',
      countryOfOrigin: ''
    });
    setEditingProduct(null);
  };
  
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm(product);
    setActiveTab('addproduct');
  };
  
  const handleDeleteProduct = (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      // Delete from state - REAL TIME UPDATE
      setProducts(products.filter(p => p.id !== productId));
      
      // Delete from treeManager
      treeManager.deleteProduct(user.userId, productId);
      
      alert('Product deleted successfully!');
    }
  };

  const handleAccessorySubmit = (e) => {
    e.preventDefault();
    
    if (editingAccessory) {
      // Update existing accessory
      const updatedAccessories = accessories.map(a => 
        a.id === editingAccessory.id 
          ? { ...accessoryForm, id: editingAccessory.id }
          : a
      );
      setAccessories(updatedAccessories);
      
      // Update in treeManager
      treeManager.updateAccessory(user.userId, { ...accessoryForm, id: editingAccessory.id });
      
      alert('Accessory updated successfully!');
    } else {
      // Add new accessory
      const newAccessory = {
        ...accessoryForm,
        id: Date.now().toString()
      };
      setAccessories([...accessories, newAccessory]);
      
      // Save to treeManager
      treeManager.addAccessory(user.userId, newAccessory);
      
      alert('Accessory added successfully!');
    }
    
    // Reset form and go back to products list
    resetAccessoryForm();
    setActiveTab('products');
  };

  const resetAccessoryForm = () => {
    setAccessoryForm({
      name: '',
      brandName: '',
      price: '',
      discountedPrice: '',
      offer: '',
      category: '',
      subCategory: '',
      stockQuantity: '',
      sku: '',
      hsnCode: '',
      accessoryType: '',
      material: '',
      color: '',
      size: '',
      dimensions: '',
      weight: '',
      shortDescription: '',
      fullDescription: '',
      keyFeatures: '',
      careInstructions: '',
      images: [],
      videoLink: '',
      instagramLink: '',
      packageDimensions: '',
      weight: '',
      deliveryAvailability: '',
      codOption: '',
      sellerAddress: '',
      returnPolicy: '',
      gstPercentage: '',
      manufacturerDetails: '',
      countryOfOrigin: '',
      warranty: '',
      authenticityCertificate: null,
      specialFeatures: ''
    });
    setEditingAccessory(null);
  };

  const handlePortalClick = () => {
    setShowTeamPortal(true);
  };
  
  const handleBackToDashboard = () => {
    setShowTeamPortal(false);
  };
  
  if (showTeamPortal) {
    return (
      <ManageTeamPortal
        user={user}
        onLogout={onLogout}
        onSwitchToDashboard={handleBackToDashboard}
      />
    );
  }
  
  // E-Wallet functions
  const handleAddMoney = () => {
    if (paymentAmount >= 10 && paymentAmount <= 50000) {
      setShowPaymentGateway(true);
    } else {
      alert('Please enter an amount between ₹10 and ₹50,000');
    }
  };
  
  const processPayment = () => {
    // In a real app, this would integrate with a payment gateway
    // For demo purposes, we'll simulate a successful payment
    setTimeout(() => {
      const newTransactionId = 'TXN' + Math.floor(Math.random() * 1000000);
      setTransactionId(newTransactionId);
      
      // Update eWallet balance
      setFinancialData(prev => ({
        ...prev,
        eWallet: prev.eWallet + parseFloat(paymentAmount)
      }));
      
      // Update the tree manager data
      treeManager.updateEWalletBalance(user.userId, financialData.eWallet + parseFloat(paymentAmount));
      
      // Show success message
      setShowPaymentGateway(false);
      setPaymentSuccess(true);
      setPaymentAmount('');
      
      // Hide success message after 5 seconds
      setTimeout(() => setPaymentSuccess(false), 5000);
    }, 2000);
  };
  
  const renderPaymentGateway = () => {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Complete Payment</h3>
            <button 
              onClick={() => setShowPaymentGateway(false)}
              className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">Amount to Pay</div>
            <div className="text-2xl font-bold">₹{paymentAmount}</div>
          </div>
          
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-2">Payment Method</div>
            <div className="bg-gray-100 p-3 rounded-md">
              <div className="flex items-center">
                {paymentMethod === 'upi' && <div className="mr-3"></div>}
                {paymentMethod === 'card' && <div className="mr-3"></div>}
                {paymentMethod === 'netbanking' && <div className="mr-3"></div>}
                <div className="font-medium capitalize">{paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Net Banking'}</div>
              </div>
            </div>
          </div>
          
          <div className="mb-4 p-3 bg-yellow-50 rounded-md">
            <div className="text-sm text-yellow-800">
              This is a demo payment gateway. In a real application, this would connect to an actual payment service provider.
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowPaymentGateway(false)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              onClick={processPayment}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderAddMoneyModal = () => {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add Money to E-Wallet</h3>
            <button 
              onClick={() => setShowAddMoneyModal(false)}
              className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Amount (₹)</label>
            <input 
              type="number" 
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount between ₹10 to ₹50,000"
              min="10"
              max="50000"
            />
            <div className="text-xs text-gray-500 mt-1">Minimum: ₹10, Maximum: ₹50,000</div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Payment Method</label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="mr-3"
                />
                <div>UPI</div>
              </label>
              <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mr-3"
                />
                <div>Credit/Debit Card</div>
              </label>
              <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="netbanking"
                  checked={paymentMethod === 'netbanking'}
                  onChange={() => setPaymentMethod('netbanking')}
                  className="mr-3"
                />
                <div className="w-8 h-8 bg-blue-500 rounded-full mr-3"></div>
                <div>Net Banking</div>
              </label>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowAddMoneyModal(false)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddMoney}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Money
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add this sync function
  const handleSyncToPlatform = async () => {
    setSyncing(true);
    setSyncMessage(null);
    
    try {
      // Prepare the data to sync
      const syncData = {
        products: products,
        timestamp: new Date().toISOString(),
        brandId: 'your-brand-id', // Replace with actual brand ID
        totalProducts: products.length,
        totalStock: products.reduce((sum, product) => sum + (product.stockQuantity || 0), 0)
      };
      
      // Make API call to sync with platform
      const response = await fetch('https://your-platform-api.com/inventory/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-auth-token' // Replace with actual auth
        },
        body: JSON.stringify(syncData)
      });
      
      if (response.ok) {
        // Update last synced timestamp for each product
        const updatedProducts = products.map(product => ({
          ...product,
          lastSynced: new Date().toISOString()
        }));
        setProducts(updatedProducts);
        
        setSyncMessage({
          type: 'success',
          text: `Successfully synced ${products.length} products to platform inventory`
        });
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncMessage({
        type: 'error',
        text: 'Failed to sync products. Please try again.'
      });
    } finally {
      setSyncing(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSyncMessage(null);
      }, 5000);
    }
  };

  const categorySubCategories = {
    "Men's Clothing": [
      "T-Shirts", "Casual Shirts", "Formal Shirts", "Sweatshirts", "Sweaters", "Jackets", 
      "Blazers & Coats", "Suits", "Rain Jackets", "Kurtas & Kurta Sets", "Sherwanis", 
      "Nehru Jackets", "Dhotis", "Jeans", "Casual Trousers", "Formal Trousers", "Shorts", 
      "Track Pants & Joggers", "Briefs & Trunks", "Boxers", "Vests", "Sleepwear & Loungewear", "Thermals"
    ],
    "Women's Clothing": [
      "Kurtas & Suits", "Kurtis, Tunics & Tops", "Sarees", "Leggings, Salwars & Churidars", 
      "Skirts & Palazzos", "Dress Materials", "Lehenga Cholis", "Dupattas & Shawls", "Jackets", 
      "Dresses", "Tops", "Tshirts", "Jeans", "Trousers & Capris", "Shorts & Skirts", "Co-ords", 
      "Playsuits", "Jumpsuits", "Shrugs", "Sweaters & Sweatshirts", "Jackets & Coats", "Blazers & Waistcoats"
    ],
    "Ethnic Wear": [
      "Ethnic Jackets", "Ethnic Suit Sets", "Kurtas", "Pyjamas & Churidars", "Sherwani Sets", 
      "Stoles", "Co-ord Sets", "Dresses & Gowns", "Kurta Suit Sets", "Kurta-Bottom Set", 
      "Kurtas", "Kurtis & Tunics", "Lehenga Choli Sets", "Salwars & Churidars", "Sarees"
    ],
    "Western Wear": [
      "Jeans", "Shirts", "Shorts & 3/4ths", "Suit Sets", "Track Pants", "Tracksuits", 
      "Trousers & Pants", "Tshirts", "Dresses", "Jeans & Jeggings", "Tops", "Trousers & Pants", 
      "Tshirts", "Track Pants", "Shirts", "Leggings"
    ]
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Brand Owner Dashboard</h2>
            
            {/* Financial Overview - REAL TIME DATA */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">Total Payout</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{financialData.totalPayout}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Total earnings from direct income</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">Income Wallet</div>
                  <div className="text-2xl font-bold text-green-600">
                    ₹{financialData.incomeWallet}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Available for withdrawal</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">E-Wallet</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{financialData.eWallet}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Available for purchases</div>
                </div>
              </div>
            </div>
            
            {/* User Status - REAL TIME DATA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">KYC Status</label>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userData?.kycVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userData?.kycVerified ? 'Verified' : 'Not Verified'}
                  </span>
                  {!userData?.kycVerified && (
                    <button 
                      onClick={() => setActiveTab('kyc')}
                      className="ml-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Verify Now
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account</label>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userData?.bankAccount 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userData?.bankAccount ? 'Added' : 'Not Added'}
                  </span>
                  {!userData?.bankAccount && (
                    <button 
                      onClick={() => setActiveTab('bank')}
                      className="ml-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Add Now
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Product Statistics - REAL TIME DATA */}
            <div className="mb-8 p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Product Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">Total Products</div>
                  <div className="text-2xl font-bold text-green-600">
                    {products.length}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Products uploaded</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">Product Views</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {products.reduce((sum, p) => sum + (p.views || 0), 0)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Total product views</div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <button
                  onClick={() => setActiveTab('products')}
                  className="p-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-md"
                >
                  <div className="text-lg font-semibold">Manage Products</div>
                  <div className="text-sm opacity-90 mt-1">Add, edit, or remove products</div>
                </button>
                <button
                  onClick={() => setActiveTab('team')}
                  className="p-4 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all shadow-md"
                >
                  <div className="text-lg font-semibold">Manage Team Members</div>
                  <div className="text-sm opacity-90 mt-1">Add or remove team members</div>
                </button>
                <button
                  onClick={() => setActiveTab('ewallet')}
                  className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
                >
                  <div className="text-lg font-semibold">E-Wallet</div>
                  <div className="text-sm opacity-90 mt-1">Add money to wallet</div>
                </button>
                <button
                  onClick={() => setActiveTab('incomewallet')}
                  className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md"
                >
                  <div className="text-lg font-semibold">Income Wallet</div>
                  <div className="text-sm opacity-90 mt-1">Withdraw earnings</div>
                </button>
                <button
                  onClick={() => setActiveTab('kyc')}
                  className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
                >
                  <div className="text-lg font-semibold">KYC Verification</div>
                  <div className="text-sm opacity-90 mt-1">Complete your verification</div>
                </button>
           </div>
          </div>
        );
        
      case 'ewallet':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">E-Wallet</h2>
            
            {/* Success Message */}
            {paymentSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <Check className="text-green-600 mr-2" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Payment Successful!</h3>
                    <p className="text-green-700">₹{paymentAmount} has been added to your E-Wallet.</p>
                    <p className="text-green-700 text-sm">Transaction ID: {transactionId}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Wallet Balance Card - Changed to blue theme like financial overview */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Available Balance</div>
                    <div className="text-3xl font-bold text-blue-600">₹{financialData.eWallet}</div>
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <Wallet size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Add Money Button - Changed to blue theme */}
            <button 
              onClick={() => setShowAddMoneyModal(true)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
            >
              <Plus size={20} className="mr-2" />
              Add Money
            </button>
            
            {/* Transaction History */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentSuccess ? (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date().toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transactionId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Wallet Top-up
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          +₹{paymentAmount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Success
                          </span>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'incomewallet':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Income Wallet</h2>
            
            {/* Withdrawal Confirmation Modal */}
            {showWithdrawalConfirmation && currentWithdrawal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg w-full max-w-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Withdrawal Request Initiated</h3>
                    <button 
                      onClick={() => setShowWithdrawalConfirmation(false)}
                      className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="mb-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Check className="text-green-600 mr-2" size={24} />
                      <h3 className="text-lg font-semibold text-green-800">Request Successful!</h3>
                    </div>
                    <p className="text-green-700">Your withdrawal request has been initiated successfully.</p>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Request ID:</span>
                      <span className="font-medium">{currentWithdrawal.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Withdrawal Amount:</span>
                      <span className="font-medium">₹{currentWithdrawal.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax Deducted:</span>
                      <span className="font-medium">₹{currentWithdrawal.tax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credited Amount:</span>
                      <span className="font-medium text-green-600">₹{currentWithdrawal.creditedAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Credit Date:</span>
                      <span className="font-medium">{currentWithdrawal.expectedCreditDate}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 rounded-md mb-4">
                    <p className="text-sm text-yellow-800">
                      The amount will be credited to your bank account within 3 business days.
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => setShowWithdrawalConfirmation(false)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
            
            {/* Wallet Balance Card */}
            <div className="mb-8 p-4 bg-green-50 rounded-lg">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Available Balance</div>
                    <div className="text-3xl font-bold text-green-600">₹{financialData.incomeWallet}</div>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <Wallet size={24} className="text-green-600" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Withdrawal Form */}
            <div className="mb-8 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Request Withdrawal</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter Amount (₹)</label>
                <input 
                  type="number" 
                  value={withdrawalAmount}
                  onChange={handleWithdrawalAmountChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter amount to withdraw"
                  min="1"
                  max={financialData.incomeWallet}
                />
                {withdrawalAmount && parseFloat(withdrawalAmount) > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    Tax: ₹{calculateTax(parseFloat(withdrawalAmount))} | 
                    Credited Amount: ₹{(parseFloat(withdrawalAmount) - calculateTax(parseFloat(withdrawalAmount))).toFixed(2)}
                  </div>
                )}
              </div>
              
              {/* Expected Credit Timeline */}
              {withdrawalAmount && parseFloat(withdrawalAmount) > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-md">
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Expected Credit Timeline:</p>
                    <p>{getExpectedCreditTimeline()?.day}, {getExpectedCreditTimeline()?.date} at {getExpectedCreditTimeline()?.time}</p>
                  </div>
                </div>
              )}
              
              <button 
                onClick={handleWithdrawalRequest}
                disabled={!withdrawalAmount || parseFloat(withdrawalAmount) <= 0 || parseFloat(withdrawalAmount) > financialData.incomeWallet}
                className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  withdrawalAmount && parseFloat(withdrawalAmount) > 0 && parseFloat(withdrawalAmount) <= financialData.incomeWallet
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Proceed with Withdrawal
              </button>
            </div>
            
            {/* Tax Information */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Tax Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Up to ₹10,000:</span>
                  <span className="font-medium">No Tax</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">₹10,001 to ₹50,000:</span>
                  <span className="font-medium">5% Tax</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">₹50,001 to ₹100,000:</span>
                  <span className="font-medium">10% Tax</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Above ₹100,000:</span>
                  <span className="font-medium">15% Tax</span>
                </div>
              </div>
            </div>
            
            {/* Transaction History */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Withdrawal History</h3>
              {withdrawalHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Request ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tax Deducted
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Credited Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {withdrawalHistory.map((withdrawal) => (
                        <tr key={withdrawal.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {withdrawal.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {withdrawal.date} {withdrawal.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{withdrawal.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{withdrawal.tax}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            ₹{withdrawal.creditedAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              withdrawal.status === 'Completed' 
                                ? 'bg-green-100 text-green-800' 
                                : withdrawal.status === 'Processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {withdrawal.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-center text-gray-500">No withdrawal history found</p>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'products':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    resetProductForm();
                    setActiveTab('addproduct');
                  }}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus size={20} className="mr-2" />
                  Add Product
                </button>
                <button
                  onClick={() => {
                    resetProductForm();
                    setActiveTab('addaccessory');
                  }}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  <Plus size={20} className="mr-2" />
                  Add Accessory
                </button>
                <button
                  onClick={handleSyncToPlatform}
                  disabled={syncing}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {syncing ? (
                    <>
                      <RefreshCw size={20} className="mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <Upload size={20} className="mr-2" />
                      Sync to Platform
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowBulkOperations(!showBulkOperations)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <Package size={20} className="mr-2" />
                  Bulk Operations
                </button>
              </div>
            </div>
            
            {/* Sync Status Message */}
            {syncMessage && (
              <div className={`mb-4 p-3 rounded-md ${
                syncMessage.type === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                <div className="flex items-center">
                  {syncMessage.type === 'success' ? (
                    <CheckCircle size={20} className="mr-2" />
                  ) : (
                    <AlertCircle size={20} className="mr-2" />
                  )}
                  <span className="text-sm">{syncMessage.text}</span>
                </div>
              </div>
            )}
            
            {/* Bulk Operations Panel */}
            {showBulkOperations && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <h3 className="text-lg font-semibold mb-3">Bulk Operations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Import/Export</h4>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                        Export Products
                      </button>
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                        Import Products
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Bulk Updates</h4>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
                        Update Prices
                      </button>
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
                        Update Stock
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Product Filters and Search */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Categories</option>
                    <option value="Men's Clothing">Men's Clothing</option>
                    <option value="Women's Clothing">Women's Clothing</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Stock</option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  Apply Filters
                </button>
              </div>
            </div>
            
            {products.length > 0 ? (
              <>
                {/* Product Statistics */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                      <Package className="text-blue-600 mr-2" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Total Products</p>
                        <p className="text-xl font-semibold">{products.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <CheckCircle className="text-green-600 mr-2" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">In Stock</p>
                        <p className="text-xl font-semibold">{products.filter(p => (p.stockQuantity || 0) > 0).length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center">
                      <AlertTriangle className="text-yellow-600 mr-2" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Low Stock</p>
                        <p className="text-xl font-semibold">{products.filter(p => (p.stockQuantity || 0) > 0 && (p.stockQuantity || 0) < 10).length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center">
                      <XCircle className="text-red-600 mr-2" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Out of Stock</p>
                        <p className="text-xl font-semibold">{products.filter(p => (p.stockQuantity || 0) === 0).length}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <div key={product.id} className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${product.status === 'draft' ? 'opacity-75' : ''}`}>
                      {product.images && product.images.length > 0 ? (
                        <div className="relative">
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-48 object-cover"
                          />
                          {/* Product Status Badges */}
                          <div className="absolute top-2 left-2 flex flex-col space-y-1">
                            {product.status === 'draft' && (
                              <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded">
                                Draft
                              </span>
                            )}
                            {product.featured && (
                              <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">
                                Featured
                              </span>
                            )}
                            {product.newProduct && (
                              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                                New
                              </span>
                            )}
                            {product.onSale && (
                              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                                Sale
                              </span>
                            )}
                            {(product.stockQuantity || 0) === 0 && (
                              <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                                Out of Stock
                              </span>
                            )}
                            {(product.stockQuantity || 0) > 0 && (product.stockQuantity || 0) < 10 && (
                              <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">
                                Low Stock
                              </span>
                            )}
                          </div>
                          {/* Last Synced Badge */}
                          {product.lastSynced && (
                            <span className="absolute top-2 right-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                              Synced
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">{product.name}</h3>
                          <div className="flex items-center space-x-1">
                            {/* Rating Display */}
                            {product.rating && (
                              <div className="flex items-center">
                                <Star size={14} className="text-yellow-500 fill-current" />
                                <span className="text-xs ml-1">{product.rating}</span>
                              </div>
                            )}
                            {/* View Count */}
                            {product.viewCount && (
                              <div className="flex items-center text-gray-500">
                                <Eye size={14} className="mr-1" />
                                <span className="text-xs">{product.viewCount}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {product.brandName && <p className="text-sm text-gray-600 mb-2">{product.brandName}</p>}
                        
                        {/* SEO URL Slug */}
                        {product.slug && (
                          <p className="text-xs text-gray-500 mb-2 truncate">
                            URL: /products/{product.slug}
                          </p>
                        )}
                        
                        {/* Pricing Information */}
                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                          <p><span className="font-medium">MRP:</span> ₹{product.price || product.mrp}</p>
                          {product.sellingPrice && <p><span className="font-medium">Selling Price:</span> ₹{product.sellingPrice}</p>}
                          {product.gstInclusivePrice && <p><span className="font-medium">GST Inclusive:</span> ₹{product.gstInclusivePrice}</p>}
                          {product.offer && <p><span className="font-medium">Offer:</span> {product.offer}</p>}
                          {product.credits && <p><span className="font-medium">Credits:</span> {product.credits}</p>}
                        </div>
                        
                        {/* Product Classification */}
                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                          <p><span className="font-medium">Category:</span> {product.category}</p>
                          {product.subCategory && <p><span className="font-medium">Sub-Category:</span> {product.subCategory}</p>}
                          {product.gender && <p><span className="font-medium">Gender:</span> {product.gender}</p>}
                          {product.occasion && <p><span className="font-medium">Occasion:</span> {product.occasion}</p>}
                        </div>
                        
                        {/* Inventory Information */}
                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                          <p><span className="font-medium">Stock:</span> {product.stockQuantity || 0}</p>
                          {product.sku && <p><span className="font-medium">SKU:</span> {product.sku}</p>}
                          {product.hsnCode && <p><span className="font-medium">HSN Code:</span> {product.hsnCode}</p>}
                          {product.gstPercentage && <p><span className="font-medium">GST:</span> {product.gstPercentage}</p>}
                        </div>
                        
                        {/* Product Variants */}
                        <div className="mb-3 p-2 bg-gray-50 rounded">
                          <div className="text-xs text-gray-600">
                            {product.colors && (
                              <p className="mb-1">
                                <span className="font-medium">Colors:</span> {product.colors}
                              </p>
                            )}
                            {product.sizes && (
                              <p className="mb-1">
                                <span className="font-medium">Sizes:</span> {product.sizes}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Product Status and Actions */}
                        <div className="mb-3 p-2 bg-gray-50 rounded">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Status</span>
                            <select
                              value={product.status || 'draft'}
                              onChange={(e) => {
                                const updatedProducts = products.map(p => 
                                  p.id === product.id ? { ...p, status: e.target.value } : p
                                );
                                setProducts(updatedProducts);
                              }}
                              className="text-xs px-2 py-1 border border-gray-300 rounded"
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                              <option value="archived">Archived</option>
                            </select>
                          </div>
                          <div className="flex items-center space-x-4 text-xs">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={product.featured || false}
                                onChange={(e) => {
                                  const updatedProducts = products.map(p => 
                                    p.id === product.id ? { ...p, featured: e.target.checked } : p
                                  );
                                  setProducts(updatedProducts);
                                }}
                                className="mr-1"
                              />
                              Featured
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={product.newProduct || false}
                                onChange={(e) => {
                                  const updatedProducts = products.map(p => 
                                    p.id === product.id ? { ...p, newProduct: e.target.checked } : p
                                  );
                                  setProducts(updatedProducts);
                                }}
                                className="mr-1"
                              />
                              New
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={product.onSale || false}
                                onChange={(e) => {
                                  const updatedProducts = products.map(p => 
                                    p.id === product.id ? { ...p, onSale: e.target.checked } : p
                                  );
                                  setProducts(updatedProducts);
                                }}
                                className="mr-1"
                              />
                              On Sale
                            </label>
                          </div>
                        </div>
                        
                        {/* Stock Management Section */}
                        <div className="mb-3 p-2 bg-gray-50 rounded">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Stock & Variants</span>
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowStockModal(true);
                                setStockUpdateType('add');
                                setVariantTab('stock');
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <Edit size={12} className="mr-1" />
                              Manage
                            </button>
                          </div>
                          <div className="text-xs text-gray-600">
                            <p>Total Stock: {product.stockQuantity || 0}</p>
                            {product.lastUpdated && (
                              <p>Last Updated: {new Date(product.lastUpdated).toLocaleDateString()}</p>
                            )}
                            {product.stockHistory && product.stockHistory.length > 0 && (
                              <p>History: {product.stockHistory.length} updates</p>
                            )}
                          </div>
                        </div>
                        
                        {/* SEO and Marketing */}
                        <details className="mb-3">
                          <summary className="text-sm font-medium cursor-pointer text-blue-600">SEO & Marketing</summary>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            {product.metaTitle && <p><span className="font-medium">Meta Title:</span> {product.metaTitle}</p>}
                            {product.metaDescription && <p><span className="font-medium">Meta Description:</span> {product.metaDescription}</p>}
                            {product.tags && <p><span className="font-medium">Tags:</span> {product.tags}</p>}
                            {product.socialImage && <p><span className="font-medium">Social Image:</span> Available</p>}
                          </div>
                        </details>
                        
                        {/* Product Relationships */}
                        {product.relatedProducts && product.relatedProducts.length > 0 && (
                          <details className="mb-3">
                            <summary className="text-sm font-medium cursor-pointer text-blue-600">Related Products</summary>
                            <div className="mt-2 text-sm text-gray-600">
                              <p>Related: {product.relatedProducts.length} products</p>
                            </div>
                          </details>
                        )}
                        
                        {/* Reviews and Ratings */}
                        {product.reviews && product.reviews.length > 0 && (
                          <details className="mb-3">
                            <summary className="text-sm font-medium cursor-pointer text-blue-600">Reviews</summary>
                            <div className="mt-2 text-sm text-gray-600">
                              <p>Total Reviews: {product.reviews.length}</p>
                              <p>Average Rating: {product.rating}</p>
                            </div>
                          </details>
                        )}
                        
                        {/* Analytics */}
                        {product.analytics && (
                          <details className="mb-3">
                            <summary className="text-sm font-medium cursor-pointer text-blue-600">Analytics</summary>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <p>Views: {product.analytics.views || 0}</p>
                              <p>Add to Cart: {product.analytics.addToCart || 0}</p>
                              <p>Purchases: {product.analytics.purchases || 0}</p>
                              <p>Conversion Rate: {product.analytics.conversionRate || 0}%</p>
                            </div>
                          </details>
                        )}
                        
                        {/* Material & Fabric Details */}
                        {(product.primaryFabric || product.material || product.fabricComposition) && (
                          <details className="mb-3">
                            <summary className="text-sm font-medium cursor-pointer text-blue-600">Material Details</summary>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              {product.primaryFabric && <p><span className="font-medium">Primary Fabric:</span> {product.primaryFabric}</p>}
                              {product.material && <p><span className="font-medium">Material:</span> {product.material}</p>}
                              {product.secondaryMaterial && <p><span className="font-medium">Secondary Material:</span> {product.secondaryMaterial}</p>}
                              {product.fabricComposition && <p><span className="font-medium">Fabric Composition:</span> {product.fabricComposition}</p>}
                              {product.fabricWeight && <p><span className="font-medium">Fabric Weight:</span> {product.fabricWeight}</p>}
                              {product.fabricTransparency && <p><span className="font-medium">Transparency:</span> {product.fabricTransparency}</p>}
                              {product.fabricProperties && <p><span className="font-medium">Properties:</span> {product.fabricProperties}</p>}
                              {product.finish && <p><span className="font-medium">Finish:</span> {product.finish}</p>}
                            </div>
                          </details>
                        )}
                        
                        {/* SKU Codes Section */}
                        {product.skuCodes && product.skuCodes.length > 0 && (
                          <details className="mb-3">
                            <summary className="text-sm font-medium cursor-pointer text-blue-600">SKU Codes</summary>
                            <div className="mt-2 overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th scope="col" className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Size
                                    </th>
                                    <th scope="col" className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Color
                                    </th>
                                    <th scope="col" className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      SKU
                                    </th>
                                    <th scope="col" className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Stock
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {product.skuCodes.map((sku, index) => (
                                    <tr key={index}>
                                      <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900">
                                        {sku.size}
                                      </td>
                                      <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900">
                                        {sku.color}
                                      </td>
                                      <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900">
                                        {sku.sku}
                                      </td>
                                      <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900">
                                        {sku.stock || 0}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </details>
                        )}
                        
                        {/* Product Specifications */}
                        <details className="mb-3">
                          <summary className="text-sm font-medium cursor-pointer text-blue-600">Specifications</summary>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            {product.fitType && <p><span className="font-medium">Fit:</span> {product.fitType}</p>}
                            {product.type && <p><span className="font-medium">Type:</span> {product.type}</p>}
                            {product.pattern && <p><span className="font-medium">Pattern:</span> {product.pattern}</p>}
                            {product.neckType && <p><span className="font-medium">Neck Type:</span> {product.neckType}</p>}
                            {product.sleeveType && <p><span className="font-medium">Sleeve Type:</span> {product.sleeveType}</p>}
                            {product.length && <p><span className="font-medium">Length:</span> {product.length}</p>}
                            {product.closureType && <p><span className="font-medium">Closure Type:</span> {product.closureType}</p>}
                            {product.stretchability && <p><span className="font-medium">Stretchability:</span> {product.stretchability}</p>}
                            {product.adjustability && <p><span className="font-medium">Adjustability:</span> {product.adjustability}</p>}
                            
                            {/* Accessory Specific Details */}
                            {product.bagType && <p><span className="font-medium">Bag Type:</span> {product.bagType}</p>}
                            {product.compartments && <p><span className="font-medium">Compartments:</span> {product.compartments}</p>}
                            {product.metalType && <p><span className="font-medium">Metal Type:</span> {product.metalType}</p>}
                            {product.gemstoneType && <p><span className="font-medium">Gemstone:</span> {product.gemstoneType}</p>}
                            {product.plating && <p><span className="font-medium">Plating:</span> {product.plating}</p>}
                            {product.watchType && <p><span className="font-medium">Watch Type:</span> {product.watchType}</p>}
                            {product.bandMaterial && <p><span className="font-medium">Band Material:</span> {product.bandMaterial}</p>}
                            {product.waterResistance && <p><span className="font-medium">Water Resistance:</span> {product.waterResistance}</p>}
                          </div>
                        </details>
                        
                        {/* Dimensions & Weight */}
                        <details className="mb-3">
                          <summary className="text-sm font-medium cursor-pointer text-blue-600">Dimensions & Weight</summary>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            {product.weight && <p><span className="font-medium">Weight:</span> {product.weight}</p>}
                            {product.dimensions && <p><span className="font-medium">Dimensions:</span> {product.dimensions}</p>}
                            {product.packageDimensions && <p><span className="font-medium">Package Dimensions:</span> {product.packageDimensions}</p>}
                            {product.packageWeight && <p><span className="font-medium">Package Weight:</span> {product.packageWeight}</p>}
                            {product.packagingType && <p><span className="font-medium">Packaging Type:</span> {product.packagingType}</p>}
                          </div>
                        </details>
                        
                        {/* Model Information */}
                        {(product.modelHeight || product.modelWearingSize || product.fitNote) && (
                          <details className="mb-3">
                            <summary className="text-sm font-medium cursor-pointer text-blue-600">Model Information</summary>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              {product.modelHeight && <p><span className="font-medium">Model Height:</span> {product.modelHeight}</p>}
                              {product.modelWearingSize && <p><span className="font-medium">Model Wearing:</span> {product.modelWearingSize}</p>}
                              {product.fitNote && <p><span className="font-medium">Fit Note:</span> {product.fitNote}</p>}
                            </div>
                          </details>
                        )}
                        
                        {/* Size Chart */}
                        {(product.sizeChartImage || product.sizeGuide) && (
                          <details className="mb-3">
                            <summary className="text-sm font-medium cursor-pointer text-blue-600">Size Guide</summary>
                            <div className="mt-2">
                              {product.sizeChartImage && (
                                <img 
                                  src={product.sizeChartImage} 
                                  alt="Size Chart"
                                  className="w-32 h-auto object-cover rounded border mb-2"
                                />
                              )}
                              {product.sizeGuide && (
                                <p className="text-sm text-gray-600">{product.sizeGuide}</p>
                              )}
                            </div>
                          </details>
                        )}
                        
                        {/* Descriptions */}
                        {(product.shortDescription || product.fullDescription || product.keyFeatures || product.stylingTips) && (
                          <details className="mb-3">
                            <summary className="text-sm font-medium cursor-pointer text-blue-600">Descriptions</summary>
                            <div className="mt-2 text-sm text-gray-600">
                              {product.shortDescription && <p className="mb-2">{product.shortDescription}</p>}
                              {product.fullDescription && <p className="mb-2">{product.fullDescription}</p>}
                              {product.keyFeatures && (
                                <div className="mb-2">
                                  <p className="font-medium">Key Features:</p>
                                  <p>{product.keyFeatures}</p>
                                </div>
                              )}
                              {product.stylingTips && (
                                <div>
                                  <p className="font-medium">Styling Tips:</p>
                                  <p>{product.stylingTips}</p>
                                </div>
                              )}
                            </div>
                          </details>
                        )}
                        
                        {/* Care Instructions */}
                        {(product.washMethod || product.washTemperature || product.bleach || product.dryMethod || product.ironingDetails || product.specialCare || product.storage) && (
                          <details className="mb-3">
                            <summary className="text-sm font-medium cursor-pointer text-blue-600">Care Instructions</summary>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              {product.washMethod && <p><span className="font-medium">Wash Method:</span> {product.washMethod}</p>}
                              {product.washTemperature && <p><span className="font-medium">Temperature:</span> {product.washTemperature}</p>}
                              {product.bleach && <p><span className="font-medium">Bleach:</span> {product.bleach}</p>}
                              {product.dryMethod && <p><span className="font-medium">Dry Method:</span> {product.dryMethod}</p>}
                              {product.ironingDetails && <p><span className="font-medium">Ironing:</span> {product.ironingDetails}</p>}
                              {product.specialCare && <p><span className="font-medium">Special Care:</span> {product.specialCare}</p>}
                              {product.storage && <p><span className="font-medium">Storage:</span> {product.storage}</p>}
                            </div>
                          </details>
                        )}
                        
                        {/* Media */}
                        {(product.videoLink || product.instagramLink) && (
                          <details className="mb-3">
                            <summary className="text-sm font-medium cursor-pointer text-blue-600">Media</summary>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              {product.videoLink && (
                                <p>
                                  <span className="font-medium">Video:</span>
                                  <a href={product.videoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                                    Watch Video
                                  </a>
                                </p>
                              )}
                              {product.instagramLink && (
                                <p>
                                  <span className="font-medium">Instagram:</span>
                                  <a href={product.instagramLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                                    View on Instagram
                                  </a>
                                </p>
                              )}
                            </div>
                          </details>
                        )}
                        
                        {/* Logistics */}
                        <details className="mb-3">
                          <summary className="text-sm font-medium cursor-pointer text-blue-600">Logistics</summary>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            {product.warehouseLocation && <p><span className="font-medium">Warehouse:</span> {product.warehouseLocation}</p>}
                            {product.deliveryAvailability && <p><span className="font-medium">Delivery:</span> {product.deliveryAvailability}</p>}
                            {product.codOption && <p><span className="font-medium">COD:</span> {product.codOption}</p>}
                            {product.returnPolicy && <p><span className="font-medium">Return Policy:</span> {product.returnPolicy}</p>}
                            {product.shippingClass && <p><span className="font-medium">Shipping Class:</span> {product.shippingClass}</p>}
                            {product.freeShipping && <p><span className="font-medium">Free Shipping:</span> {product.freeShipping ? 'Yes' : 'No'}</p>}
                          </div>
                        </details>
                        
                        {/* Pricing Strategy */}
                        {(product.tieredPricing || product.volumeDiscount || product.specialPricing) && (
                          <details className="mb-3">
                            <summary className="text-sm font-medium cursor-pointer text-blue-600">Pricing Strategy</summary>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              {product.tieredPricing && <p><span className="font-medium">Tiered Pricing:</span> Available</p>}
                              {product.volumeDiscount && <p><span className="font-medium">Volume Discount:</span> {product.volumeDiscount}</p>}
                              {product.specialPricing && <p><span className="font-medium">Special Pricing:</span> {product.specialPricing}</p>}
                            </div>
                          </details>
                        )}
                        
                        {/* Tax Management */}
                        {(product.taxClass || product.taxExempt || product.regionSpecificTax) && (
                          <details className="mb-3">
                            <summary className="text-sm font-medium cursor-pointer text-blue-600">Tax Management</summary>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              {product.taxClass && <p><span className="font-medium">Tax Class:</span> {product.taxClass}</p>}
                              {product.taxExempt && <p><span className="font-medium">Tax Exempt:</span> {product.taxExempt ? 'Yes' : 'No'}</p>}
                              {product.regionSpecificTax && <p><span className="font-medium">Region Specific Tax:</span> Available</p>}
                            </div>
                          </details>
                        )}
                        
                        {/* Product Customization */}
                        {(product.customTextFields || product.productOptions || product.personalization) && (
                          <details className="mb-3">
                            <summary className="text-sm font-medium cursor-pointer text-blue-600">Customization</summary>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              {product.customTextFields && <p><span className="font-medium">Custom Text:</span> Available</p>}
                              {product.productOptions && <p><span className="font-medium">Product Options:</span> Available</p>}
                              {product.personalization && <p><span className="font-medium">Personalization:</span> {product.personalization}</p>}
                            </div>
                          </details>
                        )}
                        
                        {/* Product Lifecycle */}
                        {(product.launchDate || product.endOfLife || product.seasonal) && (
                          <details className="mb-3">
                            <summary className="text-sm font-medium cursor-pointer text-blue-600">Product Lifecycle</summary>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              {product.launchDate && <p><span className="font-medium">Launch Date:</span> {new Date(product.launchDate).toLocaleDateString()}</p>}
                              {product.endOfLife && <p><span className="font-medium">End of Life:</span> {new Date(product.endOfLife).toLocaleDateString()}</p>}
                              {product.seasonal && <p><span className="font-medium">Seasonal:</span> {product.seasonal}</p>}
                            </div>
                          </details>
                        )}
                        
                        {/* Multi-channel Integration */}
                        {(product.marketplaceSync || product.channelPricing || product.channelInventory) && (
                          <details className="mb-3">
                            <summary className="text-sm font-medium cursor-pointer text-blue-600">Multi-channel</summary>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              {product.marketplaceSync && <p><span className="font-medium">Marketplace Sync:</span> {product.marketplaceSync.join(', ')}</p>}
                              {product.channelPricing && <p><span className="font-medium">Channel Pricing:</span> Available</p>}
                              {product.channelInventory && <p><span className="font-medium">Channel Inventory:</span> Available</p>}
                            </div>
                          </details>
                        )}
                        
                        {/* Compliance */}
                        <details className="mb-3">
                          <summary className="text-sm font-medium cursor-pointer text-blue-600">Compliance</summary>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            {product.countryOfOrigin && <p><span className="font-medium">Country of Origin:</span> {product.countryOfOrigin}</p>}
                            {product.manufacturerDetails && <p><span className="font-medium">Manufacturer:</span> {product.manufacturerDetails}</p>}
                            {product.packerDetails && <p><span className="font-medium">Packer:</span> {product.packerDetails}</p>}
                            {product.sellerAddress && <p><span className="font-medium">Seller Address:</span> {product.sellerAddress}</p>}
                            {product.certifications && <p><span className="font-medium">Certifications:</span> {product.certifications.join(', ')}</p>}
                          </div>
                        </details>
                        
                        {/* Additional Information */}
                        {(product.tags || product.authCertificate || product.warranty) && (
                          <details className="mb-3">
                            <summary className="text-sm font-medium cursor-pointer text-blue-600">Additional Info</summary>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              {product.tags && <p><span className="font-medium">Tags:</span> {product.tags}</p>}
                              {product.authCertificate && (
                                <p>
                                  <span className="font-medium">Authenticity:</span>
                                  <span className="text-green-600 ml-1">Certificate Available</span>
                                </p>
                              )}
                              {product.warranty && <p><span className="font-medium">Warranty:</span> {product.warranty}</p>}
                            </div>
                          </details>
                        )}
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            <Edit size={16} className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Delete
                          </button>
                          <button
                            onClick={() => handleDuplicateProduct(product)}
                            className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                          >
                            <Copy size={16} className="mr-1" />
                            Duplicate
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-8 border border-gray-200 rounded-lg bg-gray-50 text-center">
                <p className="text-gray-500 mb-4">No products added yet</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      resetProductForm();
                      setActiveTab('addproduct');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Your First Product
                  </button>
                  <button
                    onClick={() => {
                      resetProductForm();
                      setActiveTab('addaccessory');
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Add Your First Accessory
                  </button>
                </div>
              </div>
            )}
            
            {/* Enhanced Stock & Variant Management Modal */}
            {showStockModal && selectedProduct && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Manage Product</h3>
                    <button
                      onClick={() => setShowStockModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Product: <span className="font-medium">{selectedProduct.name}</span>
                    </p>
                    
                    {/* Tab Navigation */}
                    <div className="flex border-b mb-4">
                      <button
                        onClick={() => setVariantTab('stock')}
                        className={`px-4 py-2 text-sm font-medium ${
                          variantTab === 'stock'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Stock Management
                      </button>
                      <button
                        onClick={() => setVariantTab('colors')}
                        className={`px-4 py-2 text-sm font-medium ${
                          variantTab === 'colors'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Colors
                      </button>
                      <button
                        onClick={() => setVariantTab('sizes')}
                        className={`px-4 py-2 text-sm font-medium ${
                          variantTab === 'sizes'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Sizes
                      </button>
                      <button
                        onClick={() => setVariantTab('seo')}
                        className={`px-4 py-2 text-sm font-medium ${
                          variantTab === 'seo'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        SEO
                      </button>
                      <button
                        onClick={() => setVariantTab('pricing')}
                        className={`px-4 py-2 text-sm font-medium ${
                          variantTab === 'pricing'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Pricing
                      </button>
                    </div>
                    
                    {/* Stock Management Tab */}
                    {variantTab === 'stock' && (
                      <div>
                        <p className="text-sm text-gray-600 mb-4">
                          Current Total Stock: <span className="font-medium">{selectedProduct.stockQuantity || 0}</span>
                        </p>
                        
                        {/* Toggle between Add and Set Stock */}
                        <div className="mb-4">
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="stockUpdateType"
                                value="add"
                                checked={stockUpdateType === 'add'}
                                onChange={() => setStockUpdateType('add')}
                                className="mr-2"
                              />
                              <span className="text-sm">Add to existing stock</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="stockUpdateType"
                                value="set"
                                checked={stockUpdateType === 'set'}
                                onChange={() => setStockUpdateType('set')}
                                className="mr-2"
                              />
                              <span className="text-sm">Set new stock quantity</span>
                            </label>
                          </div>
                        </div>
                        
                        {/* Low Stock Alert */}
                        <div className="mb-4 p-3 bg-yellow-50 rounded-md">
                          <div className="flex items-center">
                            <AlertTriangle size={16} className="text-yellow-600 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-yellow-800">Low Stock Alert</p>
                              <p className="text-xs text-yellow-700">
                                Notify when stock falls below: 
                                <input
                                  type="number"
                                  min="0"
                                  value={selectedProduct.lowStockThreshold || 10}
                                  onChange={(e) => setSelectedProduct({
                                    ...selectedProduct,
                                    lowStockThreshold: parseInt(e.target.value) || 10
                                  })}
                                  className="w-16 ml-2 px-2 py-1 border border-yellow-300 rounded text-sm"
                                />
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {selectedProduct.skuCodes && selectedProduct.skuCodes.length > 0 ? (
                          <div className="space-y-3">
                            <p className="text-sm font-medium">
                              {stockUpdateType === 'add' ? 'Add Stock by SKU:' : 'Set Stock by SKU:'}
                            </p>
                            {selectedProduct.skuCodes.map((sku, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div className="flex-1 text-xs text-gray-600">
                                  {sku.size} - {sku.color} ({sku.sku})
                                  <span className="ml-1 text-gray-500">
                                    (Current: {sku.stock || 0})
                                  </span>
                                </div>
                                <input
                                  type="number"
                                  min="0"
                                  placeholder={stockUpdateType === 'add' ? 'Add' : 'Set'}
                                  value={stockUpdateType === 'add' ? (sku.addStock || '') : (sku.newStock || '')}
                                  onChange={(e) => {
                                    const updatedSkus = [...selectedProduct.skuCodes];
                                    if (stockUpdateType === 'add') {
                                      updatedSkus[index].addStock = e.target.value;
                                    } else {
                                      updatedSkus[index].newStock = e.target.value;
                                    }
                                    setSelectedProduct({
                                      ...selectedProduct,
                                      skuCodes: updatedSkus
                                    });
                                  }}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                                {stockUpdateType === 'add' && (
                                  <div className="text-xs text-gray-500 w-16">
                                    New: {(sku.stock || 0) + (parseInt(sku.addStock) || 0)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {stockUpdateType === 'add' ? 'Stock to Add' : 'New Stock Quantity'}
                            </label>
                            <input
                              type="number"
                              min="0"
                              placeholder={stockUpdateType === 'add' ? 'Enter quantity to add' : 'Enter new total quantity'}
                              value={stockUpdateType === 'add' ? (selectedProduct.addStock || '') : (selectedProduct.newStock || '')}
                              onChange={(e) => {
                                if (stockUpdateType === 'add') {
                                  setSelectedProduct({
                                    ...selectedProduct,
                                    addStock: e.target.value
                                  });
                                } else {
                                  setSelectedProduct({
                                    ...selectedProduct,
                                    newStock: e.target.value
                                  });
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {stockUpdateType === 'add' && (
                              <p className="text-xs text-gray-500 mt-1">
                                New total: {(selectedProduct.stockQuantity || 0) + (parseInt(selectedProduct.addStock) || 0)}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {/* Stock History Preview */}
                        <div className="mt-4 p-2 bg-gray-50 rounded">
                          <p className="text-xs font-medium text-gray-700 mb-1">Update Summary:</p>
                          <p className="text-xs text-gray-600">
                            {stockUpdateType === 'add' 
                              ? `Adding ${selectedProduct.skuCodes 
                                  ? selectedProduct.skuCodes.reduce((sum, sku) => sum + (parseInt(sku.addStock) || 0), 0)
                                  : (parseInt(selectedProduct.addStock) || 0)} units to existing stock`
                              : `Setting new stock quantity to ${selectedProduct.skuCodes
                                  ? selectedProduct.skuCodes.reduce((sum, sku) => sum + (parseInt(sku.newStock) || 0), 0)
                                  : (parseInt(selectedProduct.newStock) || 0)} units`
                            }
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Colors Tab */}
                    {variantTab === 'colors' && (
                      <div>
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Current Colors:</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {(selectedProduct.colors ? selectedProduct.colors.split(', ') : []).map((color, index) => (
                              <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                                <span className="text-sm">{color}</span>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const colors = selectedProduct.colors.split(', ');
                                    colors.splice(index, 1);
                                    setSelectedProduct({
                                      ...selectedProduct,
                                      colors: colors.join(', ')
                                    });
                                  }}
                                  className="ml-2 text-red-500 hover:text-red-700"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Add New Color:</label>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="text" 
                              value={selectedProduct.newColorInput || ''}
                              onChange={(e) => setSelectedProduct({...selectedProduct, newColorInput: e.target.value})}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter color name"
                            />
                            <button 
                              type="button"
                              onClick={() => {
                                if (selectedProduct.newColorInput && selectedProduct.newColorInput.trim()) {
                                  const colors = selectedProduct.colors ? selectedProduct.colors.split(', ') : [];
                                  if (!colors.includes(selectedProduct.newColorInput.trim())) {
                                    const newColors = [...colors, selectedProduct.newColorInput.trim()].join(', ');
                                    setSelectedProduct({
                                      ...selectedProduct,
                                      colors: newColors,
                                      newColorInput: ''
                                    });
                                  }
                                }
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                        
                        {/* Generate SKUs for new color */}
                        {selectedProduct.sizes && selectedProduct.colors && (
                          <div className="mt-4 p-2 bg-blue-50 rounded">
                            <p className="text-xs text-blue-700 mb-2">
                              New SKUs will be generated for the new color with existing sizes
                            </p>
                            <button 
                              type="button"
                              onClick={() => {
                                const sizes = selectedProduct.sizes.split(', ');
                                const colors = selectedProduct.colors.split(', ');
                                const brandPrefix = selectedProduct.brandName ? selectedProduct.brandName.substring(0, 3).toUpperCase() : 'BRD';
                                const categoryPrefix = selectedProduct.category ? selectedProduct.category.substring(0, 3).toUpperCase() : 'CAT';
                                
                                const existingSkus = selectedProduct.skuCodes || [];
                                const existingSkuKeys = new Set(existingSkus.map(sku => `${sku.size}-${sku.color}`));
                                
                                const newSkuCodes = [...existingSkus];
                                
                                sizes.forEach(size => {
                                  colors.forEach(color => {
                                    const skuKey = `${size}-${color}`;
                                    if (!existingSkuKeys.has(skuKey)) {
                                      const colorCode = color.substring(0, 3).toUpperCase();
                                      const sizeCode = size.toUpperCase();
                                      const skuCode = `${brandPrefix}-${categoryPrefix}-${colorCode}-${sizeCode}`;
                                      newSkuCodes.push({
                                        size: size,
                                        color: color,
                                        sku: skuCode,
                                        stock: 0
                                      });
                                    }
                                  });
                                });
                                
                                setSelectedProduct({
                                  ...selectedProduct,
                                  skuCodes: newSkuCodes
                                });
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                            >
                              Generate SKUs for All Variants
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Sizes Tab */}
                    {variantTab === 'sizes' && (
                      <div>
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Current Sizes:</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {(selectedProduct.sizes ? selectedProduct.sizes.split(', ') : []).map((size, index) => (
                              <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                                <span className="text-sm">{size}</span>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const sizes = selectedProduct.sizes.split(', ');
                                    sizes.splice(index, 1);
                                    setSelectedProduct({
                                      ...selectedProduct,
                                      sizes: sizes.join(', ')
                                    });
                                  }}
                                  className="ml-2 text-red-500 hover:text-red-700"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Add New Size:</label>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="text" 
                              value={selectedProduct.newSizeInput || ''}
                              onChange={(e) => setSelectedProduct({...selectedProduct, newSizeInput: e.target.value})}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter size (e.g., XL, 42)"
                            />
                            <button 
                              type="button"
                              onClick={() => {
                                if (selectedProduct.newSizeInput && selectedProduct.newSizeInput.trim()) {
                                  const sizes = selectedProduct.sizes ? selectedProduct.sizes.split(', ') : [];
                                  if (!sizes.includes(selectedProduct.newSizeInput.trim())) {
                                    const newSizes = [...sizes, selectedProduct.newSizeInput.trim()].join(', ');
                                    setSelectedProduct({
                                      ...selectedProduct,
                                      sizes: newSizes,
                                      newSizeInput: ''
                                    });
                                  }
                                }
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                        
                        {/* Generate SKUs for new size */}
                        {selectedProduct.sizes && selectedProduct.colors && (
                          <div className="mt-4 p-2 bg-blue-50 rounded">
                            <p className="text-xs text-blue-700 mb-2">
                              New SKUs will be generated for the new size with existing colors
                            </p>
                            <button 
                              type="button"
                              onClick={() => {
                                const sizes = selectedProduct.sizes.split(', ');
                                const colors = selectedProduct.colors.split(', ');
                                const brandPrefix = selectedProduct.brandName ? selectedProduct.brandName.substring(0, 3).toUpperCase() : 'BRD';
                                const categoryPrefix = selectedProduct.category ? selectedProduct.category.substring(0, 3).toUpperCase() : 'CAT';
                                
                                const existingSkus = selectedProduct.skuCodes || [];
                                const existingSkuKeys = new Set(existingSkus.map(sku => `${sku.size}-${sku.color}`));
                                
                                const newSkuCodes = [...existingSkus];
                                
                                sizes.forEach(size => {
                                  colors.forEach(color => {
                                    const skuKey = `${size}-${color}`;
                                    if (!existingSkuKeys.has(skuKey)) {
                                      const colorCode = color.substring(0, 3).toUpperCase();
                                      const sizeCode = size.toUpperCase();
                                      const skuCode = `${brandPrefix}-${categoryPrefix}-${colorCode}-${sizeCode}`;
                                      newSkuCodes.push({
                                        size: size,
                                        color: color,
                                        sku: skuCode,
                                        stock: 0
                                      });
                                    }
                                  });
                                });
                                
                                setSelectedProduct({
                                  ...selectedProduct,
                                  skuCodes: newSkuCodes
                                });
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                            >
                              Generate SKUs for All Variants
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* SEO Tab */}
                    {variantTab === 'seo' && (
                      <div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Product URL Slug</label>
                          <input
                            type="text"
                            value={selectedProduct.slug || ''}
                            onChange={(e) => setSelectedProduct({...selectedProduct, slug: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="product-url-slug"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            URL: /products/{selectedProduct.slug || 'product-url-slug'}
                          </p>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                          <input
                            type="text"
                            value={selectedProduct.metaTitle || ''}
                            onChange={(e) => setSelectedProduct({...selectedProduct, metaTitle: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="SEO Meta Title"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Recommended: 50-60 characters. Current: {selectedProduct.metaTitle ? selectedProduct.metaTitle.length : 0}
                          </p>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                          <textarea
                            value={selectedProduct.metaDescription || ''}
                            onChange={(e) => setSelectedProduct({...selectedProduct, metaDescription: e.target.value})}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="SEO Meta Description"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Recommended: 150-160 characters. Current: {selectedProduct.metaDescription ? selectedProduct.metaDescription.length : 0}
                          </p>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Image</label>
                          <div className="flex items-center space-x-4 mb-2">
                            <input 
                              type="file" 
                              id="social-image"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setSelectedProduct({...selectedProduct, socialImage: reader.result});
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                            />
                            <label 
                              htmlFor="social-image"
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
                            >
                              Upload Social Image
                            </label>
                          </div>
                          {selectedProduct.socialImage && (
                            <div className="mt-2">
                              <img 
                                src={selectedProduct.socialImage} 
                                alt="Social Media"
                                className="w-32 h-auto object-cover rounded border"
                              />
                              <button 
                                type="button"
                                onClick={() => setSelectedProduct({...selectedProduct, socialImage: null})}
                                className="mt-2 text-red-500 hover:text-red-700 text-sm"
                              >
                                Remove Social Image
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Product Tags</label>
                          <input
                            type="text"
                            value={selectedProduct.tags || ''}
                            onChange={(e) => setSelectedProduct({...selectedProduct, tags: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="tag1, tag2, tag3"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Separate tags with commas
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Pricing Tab */}
                    {variantTab === 'pricing' && (
                      <div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Strategy</label>
                          <select
                            value={selectedProduct.pricingStrategy || 'standard'}
                            onChange={(e) => setSelectedProduct({...selectedProduct, pricingStrategy: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="standard">Standard Pricing</option>
                            <option value="tiered">Tiered Pricing</option>
                            <option value="volume">Volume Discount</option>
                            <option value="membership">Membership Pricing</option>
                          </select>
                        </div>
                        
                        {selectedProduct.pricingStrategy === 'tiered' && (
                          <div className="mb-4 p-3 bg-gray-50 rounded">
                            <p className="text-sm font-medium text-gray-700 mb-2">Tiered Pricing</p>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  min="1"
                                  placeholder="Min Qty"
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                                <span>-</span>
                                <input
                                  type="number"
                                  min="1"
                                  placeholder="Max Qty"
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="Price"
                                  className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                                <button className="px-2 py-1 bg-red-500 text-white rounded text-sm">
                                  <X size={14} />
                                </button>
                              </div>
                              <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">
                                Add Tier
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {selectedProduct.pricingStrategy === 'volume' && (
                          <div className="mb-4 p-3 bg-gray-50 rounded">
                            <p className="text-sm font-medium text-gray-700 mb-2">Volume Discount</p>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  min="1"
                                  placeholder="Min Qty"
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                                <span>%</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.1"
                                  placeholder="Discount"
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                                <button className="px-2 py-1 bg-red-500 text-white rounded text-sm">
                                  <X size={14} />
                                </button>
                              </div>
                              <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">
                                Add Discount
                              </button>
                            </div>
                          </div>
                        )}
                        
                        <div className="mb-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedProduct.freeShipping || false}
                              onChange={(e) => setSelectedProduct({...selectedProduct, freeShipping: e.target.checked})}
                              className="mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">Free Shipping</span>
                          </label>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Class</label>
                          <select
                            value={selectedProduct.shippingClass || 'standard'}
                            onChange={(e) => setSelectedProduct({...selectedProduct, shippingClass: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="standard">Standard Shipping</option>
                            <option value="express">Express Shipping</option>
                            <option value="overnight">Overnight Shipping</option>
                            <option value="international">International Shipping</option>
                            <option value="local">Local Pickup</option>
                          </select>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tax Class</label>
                          <select
                            value={selectedProduct.taxClass || 'standard'}
                            onChange={(e) => setSelectedProduct({...selectedProduct, taxClass: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="standard">Standard Tax</option>
                            <option value="reduced">Reduced Tax</option>
                            <option value="zero">Zero Tax</option>
                            <option value="exempt">Tax Exempt</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      onClick={() => setShowStockModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const updatedProduct = { ...selectedProduct };
                        
                        // Initialize stock history if it doesn't exist
                        if (!updatedProduct.stockHistory) {
                          updatedProduct.stockHistory = [];
                        }
                        
                        // Handle stock updates
                        if (variantTab === 'stock') {
                          updatedProduct.stockHistory.push({
                            date: new Date().toISOString(),
                            previousStock: updatedProduct.stockQuantity || 0,
                            updateType: stockUpdateType
                          });
                          
                          if (updatedProduct.skuCodes && updatedProduct.skuCodes.length > 0) {
                            updatedProduct.skuCodes = updatedProduct.skuCodes.map(sku => {
                              const updatedSku = { ...sku };
                              if (stockUpdateType === 'add') {
                                updatedSku.stock = (sku.stock || 0) + (parseInt(sku.addStock) || 0);
                                delete updatedSku.addStock;
                              } else {
                                updatedSku.stock = parseInt(sku.newStock) || 0;
                                delete updatedSku.newStock;
                              }
                              return updatedSku;
                            });
                            
                            updatedProduct.stockQuantity = updatedProduct.skuCodes.reduce(
                              (sum, sku) => sum + (parseInt(sku.stock) || 0), 
                              0
                            );
                          } else {
                            if (stockUpdateType === 'add') {
                              updatedProduct.stockQuantity = (updatedProduct.stockQuantity || 0) + (parseInt(updatedProduct.addStock) || 0);
                              delete updatedProduct.addStock;
                            } else {
                              updatedProduct.stockQuantity = parseInt(updatedProduct.newStock) || 0;
                              delete updatedProduct.newStock;
                            }
                          }
                        }
                        
                        // Clean up temporary inputs
                        delete updatedProduct.newColorInput;
                        delete updatedProduct.newSizeInput;
                        
                        // Add last updated timestamp
                        updatedProduct.lastUpdated = new Date().toISOString();
                        
                        // Update the product in the products array
                        const updatedProducts = products.map(p => 
                          p.id === updatedProduct.id ? updatedProduct : p
                        );
                        setProducts(updatedProducts);
                        
                        // Close the modal
                        setShowStockModal(false);
                        
                        // Show success message
                        alert(`${variantTab === 'stock' 
                          ? `Stock ${stockUpdateType === 'add' ? 'added' : 'updated'}`
                          : variantTab === 'colors' 
                          ? 'Colors updated'
                          : variantTab === 'sizes'
                          ? 'Sizes updated'
                          : variantTab === 'seo'
                          ? 'SEO details updated'
                          : 'Pricing updated'
                        } successfully!`);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {variantTab === 'stock' 
                        ? (stockUpdateType === 'add' ? 'Add Stock' : 'Update Stock')
                        : 'Update Product'
                      }
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'addproduct':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingProduct ? 'Edit Fashion Product' : 'Add New Fashion Product'}
              </h2>
              <button
                onClick={() => {
                  resetProductForm();
                  setActiveTab('products');
                }}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                <X size={20} className="mr-2" />
                Cancel
              </button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="space-y-6">
  {/* Basic Information Section */}
  <div className="border-b pb-4">
    <h4 className="text-md font-medium text-gray-900 mb-3">Basic Product Information</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name / Title *</label>
        <input 
          type="text" 
          value={productForm.name}
          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter product name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name *</label>
        <input 
          type="text" 
          value={productForm.brandName}
          onChange={(e) => setProductForm({...productForm, brandName: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter brand name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
        <select 
          value={productForm.category}
          onChange={(e) => {
            setProductForm({
              ...productForm, 
              category: e.target.value, 
              subCategory: '' // Reset subcategory when category changes
            });
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Category</option>
          <option value="Men's Clothing">Men's Clothing</option>
          <option value="Women's Clothing">Women's Clothing</option>
          <option value="Ethnic Wear">Ethnic Wear</option>
          <option value="Western Wear">Western Wear</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Category *</label>
        <select 
          value={productForm.subCategory}
          onChange={(e) => setProductForm({...productForm, subCategory: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={!productForm.category}
        >
          <option value="">{productForm.category ? "Select Sub-Category" : "Select Category First"}</option>
          {productForm.category && categorySubCategories[productForm.category]?.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product MRP (₹) *</label>
        <input 
          type="number" 
          value={productForm.price}
          onChange={(e) => {
            const price = e.target.value;
            setProductForm({
              ...productForm, 
              price: price,
              // If Selling Price is empty, default it to MRP for now, or calculate GST inclusive
              sellingPrice: productForm.sellingPrice || price
            });
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter MRP"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹) *</label>
        <input 
          type="number" 
          value={productForm.sellingPrice || productForm.price}
          onChange={(e) => setProductForm({...productForm, sellingPrice: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Selling Price"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">GST Inclusive Price (₹) *</label>
        <input 
          type="text" 
          value={productForm.sellingPrice || productForm.price || '0.00'}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
          placeholder="Auto-calculated"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">GST Rate (%) *</label>
        <select 
          value={productForm.gstPercentage}
          onChange={(e) => setProductForm({...productForm, gstPercentage: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select GST</option>
          <option value="0%">0%</option>
          <option value="5%">5%</option>
          <option value="12%">12%</option>
          <option value="18%">18%</option>
          <option value="28%">28%</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">HSN Code *</label>
        <input 
          type="text" 
          value={productForm.hsnCode}
          onChange={(e) => setProductForm({...productForm, hsnCode: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Auto-generated based on norms"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Country of Origin *</label>
        <input 
          type="text" 
          value={productForm.countryOfOrigin}
          onChange={(e) => setProductForm({...productForm, countryOfOrigin: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., India"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Material / Fabric *</label>
        <select 
          value={productForm.primaryFabric || ''}
          onChange={(e) => setProductForm({...productForm, primaryFabric: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Fabric</option>
          <option value="Cotton">Cotton</option>
          <option value="Silk">Silk</option>
          <option value="Linen">Linen</option>
          <option value="Wool">Wool</option>
          <option value="Polyester">Polyester</option>
          <option value="Rayon">Rayon</option>
          <option value="Nylon">Nylon</option>
          <option value="Viscose">Viscose</option>
          <option value="Acrylic">Acrylic</option>
          <option value="Spandex">Spandex</option>
          <option value="Denim">Denim</option>
          <option value="Velvet">Velvet</option>
          <option value="Chiffon">Chiffon</option>
          <option value="Georgette">Georgette</option>
          <option value="Satin">Satin</option>
          <option value="Crepe">Crepe</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fit / Pattern *</label>
        <select 
          value={productForm.fitType}
          onChange={(e) => setProductForm({...productForm, fitType: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Fit</option>
          <option value="Regular Fit">Regular Fit</option>
          <option value="Slim Fit">Slim Fit</option>
          <option value="Oversized">Oversized</option>
          <option value="Skinny Fit">Skinny Fit</option>
          <option value="Relaxed Fit">Relaxed Fit</option>
          <option value="Loose Fit">Loose Fit</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
        <input 
          type="number" 
          value={productForm.stockQuantity}
          onChange={(e) => setProductForm({...productForm, stockQuantity: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter total stock"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Weight (grams/kg) *</label>
        <input 
          type="text" 
          value={productForm.weight}
          onChange={(e) => setProductForm({...productForm, weight: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 500g"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (L×W×H) *</label>
        <input 
          type="text" 
          value={productForm.packageDimensions}
          onChange={(e) => setProductForm({...productForm, packageDimensions: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 30x20x5 cm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse / Pickup Location *</label>
        <textarea 
          value={productForm.warehouseLocation}
          onChange={(e) => setProductForm({...productForm, warehouseLocation: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter warehouse location"
          required
        />
      </div>
      <div className="md:col-span-2">
         <label className="block text-sm font-medium text-gray-700 mb-2">Product Description *</label>
         <textarea 
           value={productForm.fullDescription}
           onChange={(e) => setProductForm({...productForm, fullDescription: e.target.value})}
           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
           rows={4}
           placeholder="Detailed product description"
           required
         />
      </div>
    </div>
  </div>
  
  {/* Color Variants Section */}
  <div className="border-b pb-4">
    <h4 className="text-md font-medium text-gray-900 mb-3">Color and Size Availability *</h4>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Available Colors</label>
        <div className="flex items-center space-x-2 mb-2">
          <input 
            type="text" 
            value={productForm.colorInput || ''}
            onChange={(e) => setProductForm({...productForm, colorInput: e.target.value})}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter color name"
          />
          <button 
            type="button"
            onClick={() => {
              if (productForm.colorInput && productForm.colorInput.trim()) {
                const colors = productForm.colors ? productForm.colors.split(', ') : [];
                if (!colors.includes(productForm.colorInput.trim())) {
                  setProductForm({
                    ...productForm, 
                    colors: [...colors, productForm.colorInput.trim()].join(', '),
                    colorInput: ''
                  });
                }
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(productForm.colors ? productForm.colors.split(', ') : []).map((color, index) => (
            <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
              <span className="text-sm">{color}</span>
              <button 
                type="button"
                onClick={() => {
                  const colors = productForm.colors.split(', ');
                  colors.splice(index, 1);
                  setProductForm({...productForm, colors: colors.join(', ')});
                }}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
        <div className="flex items-center space-x-2 mb-2">
          <input 
            type="text" 
            value={productForm.sizeInput || ''}
            onChange={(e) => setProductForm({...productForm, sizeInput: e.target.value})}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter size (e.g., S, M, L)"
          />
          <button 
            type="button"
            onClick={() => {
              if (productForm.sizeInput && productForm.sizeInput.trim()) {
                const sizes = productForm.sizes ? productForm.sizes.split(', ') : [];
                if (!sizes.includes(productForm.sizeInput.trim())) {
                  setProductForm({
                    ...productForm, 
                    sizes: [...sizes, productForm.sizeInput.trim()].join(', '),
                    sizeInput: ''
                  });
                }
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(productForm.sizes ? productForm.sizes.split(', ') : []).map((size, index) => (
            <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
              <span className="text-sm">{size}</span>
              <button 
                type="button"
                onClick={() => {
                  const sizes = productForm.sizes.split(', ');
                  sizes.splice(index, 1);
                  setProductForm({...productForm, sizes: sizes.join(', ')});
                }}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* SKU Code Generation <p className="text-xs text-gray-500 mb-2">Platform auto-generates SKU codes based on size and color combinations</p> */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">SKU Codes *</label>
      
      {/* Generate SKU Codes Button */}
      <button 
        type="button"
        onClick={() => {
          // Generate SKU codes based on size and color combinations
          if (productForm.sizes && productForm.colors) {
            const sizes = productForm.sizes.split(', ');
            const colors = productForm.colors.split(', ');
            const brandPrefix = productForm.brandName ? productForm.brandName.substring(0, 3).toUpperCase() : 'BRD';
            const categoryPrefix = productForm.subCategory ? productForm.subCategory.substring(0, 3).toUpperCase() : 'CAT';
            
            const skuCodes = [];
            sizes.forEach(size => {
              colors.forEach(color => {
                const colorCode = color.substring(0, 3).toUpperCase();
                const sizeCode = size.toUpperCase();
                const skuCode = `${brandPrefix}-${categoryPrefix}-${colorCode}-${sizeCode}`;
                skuCodes.push({
                  size: size,
                  color: color,
                  sku: skuCode
                });
              });
            });
            
            setProductForm({
              ...productForm,
              skuCodes: skuCodes
            });
          }
        }}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mb-3"
      >
        Generate SKU Codes
      </button>
      
      {/* Display SKU Codes Table */}
      {productForm.skuCodes && productForm.skuCodes.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Color
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU Code
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productForm.skuCodes.map((sku, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sku.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sku.color}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sku.sku}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  </div>
  
  {/* Size Chart Section */}
  <div className="border-b pb-4">
    <h4 className="text-md font-medium text-gray-900 mb-3">Size Availability *</h4>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Size Chart Image</label>
        <div className="flex items-center space-x-4 mb-2">
          <input 
            type="file" 
            id="size-chart"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setProductForm({...productForm, sizeChartImage: reader.result});
                };
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
          />
          <label 
            htmlFor="size-chart"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer flex items-center"
          >
            <Upload size={16} className="mr-2" />
            Upload Size Chart
          </label>
        </div>
        {productForm.sizeChartImage && (
          <div className="mt-2">
            <img 
              src={productForm.sizeChartImage} 
              alt="Size Chart"
              className="w-64 h-auto object-cover rounded border"
            />
            <button 
              type="button"
              onClick={() => setProductForm({...productForm, sizeChartImage: null})}
              className="mt-2 text-red-500 hover:text-red-700"
            >
              Remove Size Chart
            </button>
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Size Guide Text</label>
        <textarea 
          value={productForm.sizeGuide || ''}
          onChange={(e) => setProductForm({...productForm, sizeGuide: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Enter size guide information"
        />
      </div>
    </div>
  </div>
  
  {/* Fabric Details Section */}
  <div className="border-b pb-4">
    <h4 className="text-md font-medium text-gray-900 mb-3">Fabric Details</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fabric Composition</label>
        <input 
          type="text" 
          value={productForm.fabricComposition || ''}
          onChange={(e) => setProductForm({...productForm, fabricComposition: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 80% Cotton, 20% Polyester"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fabric Weight</label>
        <input 
          type="text" 
          value={productForm.fabricWeight || ''}
          onChange={(e) => setProductForm({...productForm, fabricWeight: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Light, Medium, Heavy"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fabric Transparency</label>
        <select 
          value={productForm.fabricTransparency || ''}
          onChange={(e) => setProductForm({...productForm, fabricTransparency: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Transparency</option>
          <option value="Opaque">Opaque</option>
          <option value="Semi-Transparent">Semi-Transparent</option>
          <option value="Transparent">Transparent</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Fabric Properties</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {["Breathable", "Water Resistant", "UV Protection", "Wrinkle Free", 
            "Quick Dry", "Anti-Pilling", "Hypoallergenic", "Eco-Friendly"].map((property) => (
            <label key={property} className="flex items-center">
              <input 
                type="checkbox" 
                checked={productForm.fabricProperties && productForm.fabricProperties.includes(property)}
                onChange={(e) => {
                  const properties = productForm.fabricProperties ? productForm.fabricProperties.split(', ') : [];
                  if (e.target.checked) {
                    properties.push(property);
                  } else {
                    const index = properties.indexOf(property);
                    if (index > -1) {
                      properties.splice(index, 1);
                    }
                  }
                  setProductForm({...productForm, fabricProperties: properties.join(', ')});
                }}
                className="mr-2"
              />
              <span className="text-sm">{property}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>
  
  {/* Model Information Section */}
  <div className="border-b pb-4">
    <h4 className="text-md font-medium text-gray-900 mb-3">Model Information</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Model Height</label>
        <input 
          type="text" 
          value={productForm.modelHeight || ''}
          onChange={(e) => setProductForm({...productForm, modelHeight: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 5'7&quot; (170 cm)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Model Wearing Size</label>
        <input 
          type="text" 
          value={productForm.modelWearingSize || ''}
          onChange={(e) => setProductForm({...productForm, modelWearingSize: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., M, L, 38"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Fit Note</label>
        <textarea 
          value={productForm.fitNote || ''}
          onChange={(e) => setProductForm({...productForm, fitNote: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
          placeholder="Any special notes about the fit of the garment"
        />
      </div>
    </div>
  </div>
  
  {/* Descriptions Section */}
  <div className="border-b pb-4">
    <h4 className="text-md font-medium text-gray-900 mb-3">Descriptions</h4>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
        <textarea 
          value={productForm.shortDescription}
          onChange={(e) => setProductForm({...productForm, shortDescription: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
          placeholder="Brief product description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Key Features / Highlights</label>
        <textarea 
          value={productForm.keyFeatures}
          onChange={(e) => setProductForm({...productForm, keyFeatures: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="List key features of product"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Styling Tips</label>
        <textarea 
          value={productForm.stylingTips || ''}
          onChange={(e) => setProductForm({...productForm, stylingTips: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Provide styling tips for this product"
        />
      </div>
    </div>
  </div>
  
  {/* Care Instructions Section */}
  <div className="border-b pb-4">
    <h4 className="text-md font-medium text-gray-900 mb-3">Care Instructions *</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Wash Method</label>
        <select 
          value={productForm.washMethod}
          onChange={(e) => setProductForm({...productForm, washMethod: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Wash Method</option>
          <option value="Machine Wash">Machine Wash</option>
          <option value="Hand Wash">Hand Wash</option>
          <option value="Dry Clean Only">Dry Clean Only</option>
          <option value="Do Not Wash">Do Not Wash</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Wash Temperature</label>
        <select 
          value={productForm.washTemperature || ''}
          onChange={(e) => setProductForm({...productForm, washTemperature: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Temperature</option>
          <option value="Cold Water">Cold Water</option>
          <option value="Warm Water">Warm Water</option>
          <option value="Hot Water">Hot Water</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bleach</label>
        <select 
          value={productForm.bleach || ''}
          onChange={(e) => setProductForm({...productForm, bleach: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Option</option>
          <option value="Do Not Bleach">Do Not Bleach</option>
          <option value="Non-Chlorine Bleach">Non-Chlorine Bleach</option>
          <option value="Chlorine Bleach">Chlorine Bleach</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Dry Method</label>
        <select 
          value={productForm.dryMethod || ''}
          onChange={(e) => setProductForm({...productForm, dryMethod: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Dry Method</option>
          <option value="Tumble Dry Low">Tumble Dry Low</option>
          <option value="Tumble Dry Medium">Tumble Dry Medium</option>
          <option value="Tumble Dry High">Tumble Dry High</option>
          <option value="Do Not Tumble Dry">Do Not Tumble Dry</option>
          <option value="Line Dry">Line Dry</option>
          <option value="Drip Dry">Drip Dry</option>
          <option value="Flat Dry">Flat Dry</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ironing Details</label>
        <select 
          value={productForm.ironingDetails}
          onChange={(e) => setProductForm({...productForm, ironingDetails: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Ironing Option</option>
          <option value="Do Not Iron">Do Not Iron</option>
          <option value="Iron Low Heat">Iron Low Heat</option>
          <option value="Iron Medium Heat">Iron Medium Heat</option>
          <option value="Iron High Heat">Iron High Heat</option>
          <option value="Steam Iron">Steam Iron</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Special Care</label>
        <input 
          type="text" 
          value={productForm.specialCare || ''}
          onChange={(e) => setProductForm({...productForm, specialCare: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Any special care instructions"
        />
      </div>
    </div>
  </div>
  
  {/* Media Section */}
  <div className="border-b pb-4">
    <h4 className="text-md font-medium text-gray-900 mb-3">Media</h4>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images *</label>
        <p className="text-xs text-gray-500 mb-2">Min 3–5 images (Front, back, sides, close-up details, fabric texture)</p>
        <div className="flex items-center space-x-4 mb-2">
          <input 
            type="file" 
            id="product-images"
            accept="image/*"
            multiple
            onChange={handleProductImageUpload}
            className="hidden"
            required
          />
          <label 
            htmlFor="product-images"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer flex items-center"
          >
            <Upload size={16} className="mr-2" />
            Upload Images
          </label>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {productForm.images.map((image, idx) => (
            <div key={idx} className="relative">
              <img 
                src={image} 
                alt={`Product ${idx + 1}`}
                className="w-full h-24 object-cover rounded border"
              />
              <button 
                type="button"
                onClick={() => removeProductImage(idx)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Video Link</label>
        <input 
          type="url" 
          value={productForm.videoLink}
          onChange={(e) => setProductForm({...productForm, videoLink: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/video"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Video Link</label>
        <input 
          type="url" 
          value={productForm.instagramLink}
          onChange={(e) => setProductForm({...productForm, instagramLink: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://instagram.com/..."
        />
      </div>
    </div>
  </div>
  
  {/* Logistics Section */}
  <div className="border-b pb-4">
    <h4 className="text-md font-medium text-gray-900 mb-3">Logistics</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Availability</label>
        <select 
          value={productForm.deliveryAvailability}
          onChange={(e) => setProductForm({...productForm, deliveryAvailability: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Option</option>
          <option value="Pan India">Pan India</option>
          <option value="Metro Cities">Metro Cities</option>
          <option value="Select Cities">Select Cities</option>
          <option value="International">International</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">COD Option</label>
        <select 
          value={productForm.codOption}
          onChange={(e) => setProductForm({...productForm, codOption: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Option</option>
          <option value="Available">Available</option>
          <option value="Not Available">Not Available</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Seller Address</label>
        <textarea 
          value={productForm.sellerAddress}
          onChange={(e) => setProductForm({...productForm, sellerAddress: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
          placeholder="Enter seller address"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Return Policy</label>
        <textarea 
          value={productForm.returnPolicy}
          onChange={(e) => setProductForm({...productForm, returnPolicy: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Enter return policy details"
        />
      </div>
    </div>
  </div>
  
  {/* Compliance Section */}
  <div>
    <h4 className="text-md font-medium text-gray-900 mb-3">Compliance</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer Details *</label>
        <textarea 
          value={productForm.manufacturerDetails}
          onChange={(e) => setProductForm({...productForm, manufacturerDetails: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
          placeholder="Enter manufacturer or importer details"
          required
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Packer Details *</label>
        <textarea 
          value={productForm.packerDetails}
          onChange={(e) => setProductForm({...productForm, packerDetails: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
          placeholder="Enter packer details"
          required
        />
      </div>
    </div>
  </div>
  
  <div className="flex justify-end space-x-3 pt-4">
    <button 
      type="button"
      onClick={() => {
        resetProductForm();
        setActiveTab('products');
      }}
      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
    >
      Cancel
    </button>
    <button 
      type="submit"
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      {editingProduct ? 'Update Product' : 'Add Product'}
    </button>
  </div>
            </form>
          </div>
        );
        
      case 'kyc':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">KYC Verification</h2>
            {userData?.kycVerified ? (
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center">
                  <Check className="text-green-600 mr-2" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">KYC Verified</h3>
                    <p className="text-green-700">Your KYC has been successfully verified.</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleKYCSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                    <input 
                      type="text" 
                      value={kycData.pan}
                      onChange={(e) => setKycData({...kycData, pan: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your PAN number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card Photo</label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="file" 
                        id="pan-photo"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'panPhoto')}
                        className="hidden"
                      />
                      <label 
                        htmlFor="pan-photo"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
                      >
                        Choose File
                      </label>
                      {kycData.panPhoto && (
                        <div className="flex items-center">
                          <span className="text-sm text-green-600">Photo uploaded</span>
                          <button 
                            type="button"
                            onClick={() => setKycData({...kycData, panPhoto: null})}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
                    <input 
                      type="text" 
                      value={kycData.aadhaar}
                      onChange={(e) => setKycData({...kycData, aadhaar: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your Aadhar number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Card Photo</label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="file" 
                        id="aadhaar-photo"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'aadhaarPhoto')}
                        className="hidden"
                      />
                      <label 
                        htmlFor="aadhaar-photo"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
                      >
                        Choose File
                      </label>
                      {kycData.aadhaarPhoto && (
                        <div className="flex items-center">
                          <span className="text-sm text-green-600">Photo uploaded</span>
                          <button 
                            type="button"
                            onClick={() => setKycData({...kycData, aadhaarPhoto: null})}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea 
                      value={kycData.address}
                      onChange={(e) => setKycData({...kycData, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Enter your address"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="kyc-terms"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      required
                    />
                    <label htmlFor="kyc-terms" className="ml-2 text-sm text-gray-700">
                      I agree to terms and conditions for KYC verification
                    </label>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Submit KYC Verification
                  </button>
                </div>
              </form>
            )}
          </div>
        );
        
      case 'bank':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Bank Account</h2>
            {userData?.bankAccount ? (
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center">
                  <Check className="text-green-600 mr-2" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Bank Account Added</h3>
                    <p className="text-green-700">Your bank account has been successfully added.</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Account Number:</span>
                    <p className="font-medium">XXXXXX{userData.bankAccount.accountNumber.slice(-4)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">IFSC Code:</span>
                    <p className="font-medium">{userData.bankAccount.ifsc}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Bank Name:</span>
                    <p className="font-medium">{userData.bankAccount.bankName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Account Holder:</span>
                    <p className="font-medium">{userData.bankAccount.accountHolder}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBankSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                    <input 
                      type="text" 
                      value={bankData.accountNumber}
                      onChange={(e) => setBankData({...bankData, accountNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your account number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                    <input 
                      type="text" 
                      value={bankData.ifsc}
                      onChange={(e) => setBankData({...bankData, ifsc: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your IFSC code"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                    <input 
                      type="text" 
                      value={bankData.bankName}
                      onChange={(e) => setBankData({...bankData, bankName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your bank name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                    <input 
                      type="text" 
                      value={bankData.accountHolder}
                      onChange={(e) => setBankData({...bankData, accountHolder: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter account holder name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Passbook Photo</label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="file" 
                        id="passbook-photo"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'passbookPhoto')}
                        className="hidden"
                      />
                      <label 
                        htmlFor="passbook-photo"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer flex items-center"
                      >
                        <Upload size={16} className="mr-2" />
                        Choose File
                      </label>
                      {bankData.passbookPhoto && (
                        <div className="flex items-center">
                          <span className="text-sm text-green-600">Photo uploaded</span>
                          <button 
                            type="button"
                            onClick={() => setBankData({...bankData, passbookPhoto: null})}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="bank-terms"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      required
                    />
                    <label htmlFor="bank-terms" className="ml-2 text-sm text-gray-700">
                      I agree to terms and conditions for adding bank account
                    </label>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Add Bank Account
                  </button>
                </div>
              </form>
            )}
          </div>
        );

      case 'addaccessory':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingProduct ? 'Edit Accessory' : 'Add New Accessory'}
              </h2>
              <button
                onClick={() => {
                  resetProductForm();
                  setActiveTab('products');
                }}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                <X size={20} className="mr-2" />
                Cancel
              </button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="border-b pb-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accessory Name *</label>
              <input 
                type="text" 
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter accessory name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name *</label>
              <input 
                type="text" 
                value={productForm.brandName}
                onChange={(e) => setProductForm({...productForm, brandName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter brand name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select 
                value={productForm.category}
                onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="Bags">Bags</option>
                <option value="Belts">Belts</option>
                <option value="Hats">Hats</option>
                <option value="Scarves">Scarves</option>
                <option value="Gloves">Gloves</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Sunglasses">Sunglasses</option>
                <option value="Watches">Watches</option>
                <option value="Wallets">Wallets</option>
                <option value="Ties">Ties</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Category</label>
              <input 
                type="text" 
                value={productForm.subCategory}
                onChange={(e) => setProductForm({...productForm, subCategory: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Handbags, Belts, Sunglasses"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model/Style Code</label>
              <input 
                type="text" 
                value={productForm.sku}
                onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter model or style code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select 
                value={productForm.gender || ''}
                onChange={(e) => setProductForm({...productForm, gender: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Suitable Usage</label>
              <input 
                type="text" 
                value={productForm.occasion}
                onChange={(e) => setProductForm({...productForm, occasion: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Casual, Formal, Party, Travel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">HSN Code *</label>
              <input 
                type="text" 
                value={productForm.hsnCode}
                onChange={(e) => setProductForm({...productForm, hsnCode: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter HSN code"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Material Details Section */}
        <div className="border-b pb-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Material Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Material *</label>
              <input 
                type="text" 
                value={productForm.material}
                onChange={(e) => setProductForm({...productForm, material: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Leather, Canvas, Metal"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Material</label>
              <input 
                type="text" 
                value={productForm.secondaryMaterial || ''}
                onChange={(e) => setProductForm({...productForm, secondaryMaterial: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Polyester Lining, Brass Hardware"
              />
            </div>
            
            {/* Color Availability - Updated for SKU Generation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Colors *</label>
              <div className="flex items-center space-x-2 mb-2">
                <input 
                  type="text" 
                  value={productForm.colorInput || ''}
                  onChange={(e) => setProductForm({...productForm, colorInput: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter color name"
                />
                <button 
                  type="button"
                  onClick={() => {
                    if (productForm.colorInput && productForm.colorInput.trim()) {
                      const colors = productForm.colors ? productForm.colors.split(', ') : [];
                      if (!colors.includes(productForm.colorInput.trim())) {
                        setProductForm({
                          ...productForm, 
                          colors: [...colors, productForm.colorInput.trim()].join(', '),
                          colorInput: ''
                        });
                      }
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(productForm.colors ? productForm.colors.split(', ') : []).map((color, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                    <span className="text-sm">{color}</span>
                    <button 
                      type="button"
                      onClick={() => {
                        const colors = productForm.colors.split(', ');
                        colors.splice(index, 1);
                        setProductForm({...productForm, colors: colors.join(', ')});
                      }}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Finish/Texture</label>
              <input 
                type="text" 
                value={productForm.finish || ''}
                onChange={(e) => setProductForm({...productForm, finish: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Matte, Glossy, Polished, Textured"
              />
            </div>
          </div>
        </div>

        {/* Accessory-Specific Details Section */}
        <div className="border-b pb-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Accessory-Specific Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productForm.category === 'Bags' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bag Type</label>
                  <select 
                    value={productForm.bagType || ''}
                    onChange={(e) => setProductForm({...productForm, bagType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Bag Type</option>
                    <option value="Handbag">Handbag</option>
                    <option value="Backpack">Backpack</option>
                    <option value="Clutch">Clutch</option>
                    <option value="Tote">Tote</option>
                    <option value="Crossbody">Crossbody</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Closure Type</label>
                  <input 
                    type="text" 
                    value={productForm.closureType}
                    onChange={(e) => setProductForm({...productForm, closureType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Zipper, Magnetic, Button"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Compartments</label>
                  <input 
                    type="text" 
                    value={productForm.compartments || ''}
                    onChange={(e) => setProductForm({...productForm, compartments: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1 main compartment, 2 side pockets"
                  />
                </div>
              </>
            )}
            
            {productForm.category === 'Jewelry' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Metal Type</label>
                  <select 
                    value={productForm.metalType || ''}
                    onChange={(e) => setProductForm({...productForm, metalType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Metal Type</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Stainless Steel">Stainless Steel</option>
                    <option value="Brass">Brass</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gemstone Type</label>
                  <input 
                    type="text" 
                    value={productForm.gemstoneType || ''}
                    onChange={(e) => setProductForm({...productForm, gemstoneType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Diamond, Ruby, None"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plating</label>
                  <input 
                    type="text" 
                    value={productForm.plating || ''}
                    onChange={(e) => setProductForm({...productForm, plating: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 18K Gold Plated, Rhodium Plated"
                  />
                </div>
              </>
            )}
            
            {productForm.category === 'Watches' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Watch Type</label>
                  <select 
                    value={productForm.watchType || ''}
                    onChange={(e) => setProductForm({...productForm, watchType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Watch Type</option>
                    <option value="Analog">Analog</option>
                    <option value="Digital">Digital</option>
                    <option value="Smartwatch">Smartwatch</option>
                    <option value="Chronograph">Chronograph</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Band Material</label>
                  <input 
                    type="text" 
                    value={productForm.bandMaterial || ''}
                    onChange={(e) => setProductForm({...productForm, bandMaterial: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Leather, Stainless Steel, Silicone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Water Resistance</label>
                  <input 
                    type="text" 
                    value={productForm.waterResistance || ''}
                    onChange={(e) => setProductForm({...productForm, waterResistance: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 30m, 50m, 100m"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Size & Dimensions Section - Updated for SKU Generation */}
        <div className="border-b pb-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Size & Dimensions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions *</label>
              <input 
                type="text" 
                value={productForm.dimensions || ''}
                onChange={(e) => setProductForm({...productForm, dimensions: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 30cm x 20cm x 5cm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight *</label>
              <input 
                type="text" 
                value={productForm.weight}
                onChange={(e) => setProductForm({...productForm, weight: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 250g"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adjustability</label>
              <select 
                value={productForm.adjustability || ''}
                onChange={(e) => setProductForm({...productForm, adjustability: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Option</option>
                <option value="Adjustable">Adjustable</option>
                <option value="Fixed">Fixed</option>
                <option value="One Size">One Size</option>
                <option value="Multiple Sizes">Multiple Sizes</option>
              </select>
            </div>
            
            {/* Size Options - Updated for SKU Generation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size Options *</label>
              <div className="flex items-center space-x-2 mb-2">
                <input 
                  type="text" 
                  value={productForm.sizeInput || ''}
                  onChange={(e) => setProductForm({...productForm, sizeInput: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter size (e.g., S, M, L, One Size)"
                />
                <button 
                  type="button"
                  onClick={() => {
                    if (productForm.sizeInput && productForm.sizeInput.trim()) {
                      const sizes = productForm.sizes ? productForm.sizes.split(', ') : [];
                      if (!sizes.includes(productForm.sizeInput.trim())) {
                        setProductForm({
                          ...productForm, 
                          sizes: [...sizes, productForm.sizeInput.trim()].join(', '),
                          sizeInput: ''
                        });
                      }
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(productForm.sizes ? productForm.sizes.split(', ') : []).map((size, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                    <span className="text-sm">{size}</span>
                    <button 
                      type="button"
                      onClick={() => {
                        const sizes = productForm.sizes.split(', ');
                        sizes.splice(index, 1);
                        setProductForm({...productForm, sizes: sizes.join(', ')});
                      }}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* SKU Code Generation Section - New Addition */}
        <div className="border-b pb-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">SKU Code Generation</h4>
          {/* Generate SKU Codes Button */}
          <button 
            type="button"
            onClick={() => {
              // Generate SKU codes based on size and color combinations
              if (productForm.sizes && productForm.colors) {
                const sizes = productForm.sizes.split(', ');
                const colors = productForm.colors.split(', ');
                const brandPrefix = productForm.brandName ? productForm.brandName.substring(0, 3).toUpperCase() : 'BRD';
                const categoryPrefix = productForm.category ? productForm.category.substring(0, 3).toUpperCase() : 'ACC';
                
                const skuCodes = [];
                sizes.forEach(size => {
                  colors.forEach(color => {
                    const colorCode = color.substring(0, 3).toUpperCase();
                    const sizeCode = size.toUpperCase();
                    const skuCode = `${brandPrefix}-${categoryPrefix}-${colorCode}-${sizeCode}`;
                    skuCodes.push({
                      size: size,
                      color: color,
                      sku: skuCode
                    });
                  });
                });
                
                setProductForm({
                  ...productForm,
                  skuCodes: skuCodes
                });
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mb-3"
          >
            Generate SKU Codes
          </button>
          
          {/* Display SKU Codes Table */}
          {productForm.skuCodes && productForm.skuCodes.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Color
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU Code
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productForm.skuCodes.map((sku, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sku.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sku.color}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sku.sku}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Images Section */}
        <div className="border-b pb-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Product Images</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Image *</label>
              <p className="text-xs text-gray-500 mb-2">Upload a clear image of the accessory</p>
              <div className="flex items-center space-x-4 mb-2">
                <input 
                  type="file" 
                  id="primary-image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setProductForm({
                          ...productForm,
                          images: productForm.images.length > 0 
                            ? [reader.result, ...productForm.images.slice(1)]
                            : [reader.result]
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
                <label 
                  htmlFor="primary-image"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer flex items-center"
                >
                  <Upload size={16} className="mr-2" />
                  Upload Primary Image
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
              <p className="text-xs text-gray-500 mb-2">Upload images showing different angles, details, and usage</p>
              <div className="flex items-center space-x-4 mb-2">
                <input 
                  type="file" 
                  id="additional-images"
                  accept="image/*"
                  multiple
                  onChange={handleProductImageUpload}
                  className="hidden"
                />
                <label 
                  htmlFor="additional-images"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer flex items-center"
                >
                  <Upload size={16} className="mr-2" />
                  Upload Additional Images
                </label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {productForm.images.map((image, idx) => (
                  <div key={idx} className="relative">
                    <img 
                      src={image} 
                      alt={`Accessory ${idx + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <button 
                      type="button"
                      onClick={() => removeProductImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              {productForm.images && productForm.images.length < 3 && (
                <p className="text-xs text-red-500 mt-2">Please upload at least 3 images</p>
              )}
            </div>
          </div>
        </div>

        {/* Video Links Section */}
        <div className="border-b pb-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Video Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Video Link</label>
              <input 
                type="url" 
                value={productForm.videoLink}
                onChange={(e) => setProductForm({...productForm, videoLink: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/video"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Video Link</label>
              <input 
                type="url" 
                value={productForm.instagramLink}
                onChange={(e) => setProductForm({...productForm, instagramLink: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>

        {/* Return Policy Section */}
        <div className="border-b pb-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Return Policy</h4>
          <div>
            <textarea 
              value={productForm.returnPolicy}
              onChange={(e) => setProductForm({...productForm, returnPolicy: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter return policy details"
            />
          </div>
        </div>

        {/* Seller Information Section */}
        <div className="border-b pb-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Seller Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Seller Address *</label>
              <textarea 
                value={productForm.sellerAddress}
                onChange={(e) => setProductForm({...productForm, sellerAddress: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Enter seller address"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer / Importer Details *</label>
              <textarea 
                value={productForm.manufacturerDetails}
                onChange={(e) => setProductForm({...productForm, manufacturerDetails: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Enter manufacturer or importer details"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Packer Details *</label>
              <textarea 
                value={productForm.packerDetails}
                onChange={(e) => setProductForm({...productForm, packerDetails: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Enter packer details"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Pricing & Inventory Section */}
        <div className="border-b pb-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Pricing & Inventory</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product MRP (₹) *</label>
              <input 
                type="number" 
                value={productForm.mrp}
                onChange={(e) => {
                  setProductForm({
                    ...productForm, 
                    mrp: e.target.value
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter MRP"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹) *</label>
              <input 
                type="number" 
                value={productForm.price}
                onChange={(e) => {
                  const sellingPrice = e.target.value;
                  const gstRate = productForm.gstRate || 0;
                  const gstInclusivePrice = sellingPrice && !isNaN(sellingPrice) && parseFloat(sellingPrice) > 0 
                    ? (parseFloat(sellingPrice) * (1 + parseFloat(gstRate) / 100)).toFixed(2) 
                    : '';
                  const credits = sellingPrice && !isNaN(sellingPrice) && parseFloat(sellingPrice) > 0 
                    ? (parseFloat(sellingPrice) / 100).toFixed(2) 
                    : '';
                  setProductForm({
                    ...productForm, 
                    price: sellingPrice,
                    gstInclusivePrice: gstInclusivePrice,
                    credits: credits
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter selling price"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GST Inclusive Price (₹) *</label>
              <div className="flex items-center">
                <input 
                  type="text" 
                  value={productForm.gstInclusivePrice || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                  placeholder="Auto-generated based on selling price and GST rate"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GST Percentage</label>
              <select 
                value={productForm.gstPercentage}
                onChange={(e) => setProductForm({...productForm, gstPercentage: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select GST</option>
                <option value="0%">0%</option>
                <option value="5%">5%</option>
                <option value="12%">12%</option>
                <option value="18%">18%</option>
                <option value="28%">28%</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
              <div className="flex items-center">
                <input 
                  type="text" 
                  value={productForm.credits ? `${productForm.credits} Credits` : ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                  placeholder="Credits will be calculated automatically"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
              <input 
                type="text" 
                value={productForm.offer}
                onChange={(e) => setProductForm({...productForm, offer: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 20% OFF"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
              <input 
                type="number" 
                value={productForm.stockQuantity}
                onChange={(e) => setProductForm({...productForm, stockQuantity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter stock quantity"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse / Pickup Location *</label>
              <textarea 
                value={productForm.warehouseLocation}
                onChange={(e) => setProductForm({...productForm, warehouseLocation: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter warehouse location"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Description Section */}
        <div className="border-b pb-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Description</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Description *</label>
              <textarea 
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter product description"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
              <textarea 
                value={productForm.shortDescription}
                onChange={(e) => setProductForm({...productForm, shortDescription: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Brief description of the accessory"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
              <textarea 
                value={productForm.fullDescription}
                onChange={(e) => setProductForm({...productForm, fullDescription: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Detailed description of the accessory"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
              <textarea 
                value={productForm.keyFeatures}
                onChange={(e) => setProductForm({...productForm, keyFeatures: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="List key features of the accessory"
              />
            </div>
          </div>
        </div>
        
        {/* Authenticity & Warranty Section */}
        <div className="border-b pb-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Authenticity & Warranty</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Authenticity Certificate</label>
              <div className="flex items-center space-x-4 mb-2">
                <input 
                  type="file" 
                  id="auth-certificate"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setProductForm({...productForm, authCertificate: reader.result});
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
                <label 
                  htmlFor="auth-certificate"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer flex items-center"
                >
                  <Upload size={16} className="mr-2" />
                  Upload Certificate
                </label>
              </div>
              {productForm.authCertificate && (
                <div className="flex items-center">
                  <span className="text-sm text-green-600">Certificate uploaded</span>
                  <button 
                    type="button"
                    onClick={() => setProductForm({...productForm, authCertificate: null})}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warranty Details</label>
              <textarea 
                value={productForm.warranty || ''}
                onChange={(e) => setProductForm({...productForm, warranty: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Enter warranty details"
              />
            </div>
          </div>
        </div>
        
        {/* Care Instructions Section */}
        <div className="border-b pb-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Care Instructions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cleaning Method *</label>
              <input 
                type="text" 
                value={productForm.washMethod}
                onChange={(e) => setProductForm({...productForm, washMethod: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Dry clean only, Wipe with damp cloth"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Storage Instructions</label>
              <input 
                type="text" 
                value={productForm.storage || ''}
                onChange={(e) => setProductForm({...productForm, storage: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Keep in dust bag, Store in dry place"
              />
            </div>
          </div>
        </div>
        
        {/* Logistics Section */}
        <div className="border-b pb-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Logistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Weight</label>
              <input 
                type="text" 
                value={productForm.packageWeight || ''}
                onChange={(e) => setProductForm({...productForm, packageWeight: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 300g"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Dimensions</label>
              <input 
                type="text" 
                value={productForm.packageDimensions}
                onChange={(e) => setProductForm({...productForm, packageDimensions: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 25x15x5 cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Packaging Type</label>
              <select 
                value={productForm.packagingType || ''}
                onChange={(e) => setProductForm({...productForm, packagingType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Packaging Type</option>
                <option value="Box">Box</option>
                <option value="Pouch">Pouch</option>
                <option value="Dust Bag">Dust Bag</option>
                <option value="Gift Box">Gift Box</option>
                <option value="Polybag">Polybag</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">COD Option</label>
              <select 
                value={productForm.codOption}
                onChange={(e) => setProductForm({...productForm, codOption: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Option</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Additional Information Section */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Additional Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country of Origin *</label>
              <input 
                type="text" 
                value={productForm.countryOfOrigin}
                onChange={(e) => setProductForm({...productForm, countryOfOrigin: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., India"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Tags</label>
              <input 
                type="text" 
                value={productForm.tags || ''}
                onChange={(e) => setProductForm({...productForm, tags: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., leather, handcrafted, formal, gift"
              />
              <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button 
            type="button"
            onClick={() => {
              resetProductForm();
              setActiveTab('products');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {editingProduct ? 'Update Accessory' : 'Add Accessory'}
          </button>
        </div>
      </form>
          </div>
        ); 
        
      case 'team':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Team Members</h2>
              {teamMembers.length > 0 && (
                <button
                  onClick={() => setActiveTab('addTeamMember')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Team Member
                </button>
              )}
            </div>
            
            {teamMembers.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Team Members Yet</h3>
                <p className="text-gray-600 mb-6">Add your first team member to start managing your team.</p>
                <button
                  onClick={() => setActiveTab('addTeamMember')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Add First Team Member
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team Member Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team Member Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team Member Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teamMembers.map((member) => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {member.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                          <div className="relative">
                            <button
                              onClick={() => setActionMenuOpen(actionMenuOpen === member.id ? null : member.id)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <MoreVertical size={16} />
                            </button>
                            
                            {actionMenuOpen === member.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      handleEditTeamMember(member);
                                      setActionMenuOpen(null);
                                    }}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleToggleTeamMemberStatus(member.id);
                                    }}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    {member.isActive ? 'Deactivate' : 'Activate'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDeleteTeamMember(member.id);
                                    }}
                                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'addTeamMember':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add Team Member</h2>
              <button
                onClick={() => setActiveTab('team')}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSaveTeamMember(); }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Member Name</label>
                <input 
                  type="text" 
                  value={newTeamMember.name}
                  onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter team member name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Member Email</label>
                <input 
                  type="email" 
                  value={newTeamMember.email}
                  onChange={(e) => setNewTeamMember({...newTeamMember, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter team member email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Member Role</label>
                <select 
                  value={newTeamMember.role}
                  onChange={(e) => setNewTeamMember({...newTeamMember, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Premium Member">Premium Member</option>
                  <option value="Standard Member">Standard Member</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setActiveTab('team')}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        );
        
      case 'editTeamMember':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit Team Member</h2>
              <button
                onClick={() => setActiveTab('team')}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateTeamMember(); }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Member Name</label>
                <input 
                  type="text" 
                  value={editingTeamMember.name}
                  onChange={(e) => setEditingTeamMember({...editingTeamMember, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter team member name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Member Email</label>
                <input 
                  type="email" 
                  value={editingTeamMember.email}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                  placeholder="Enter team member email"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Member Role</label>
                <select 
                  value={editingTeamMember.role}
                  onChange={(e) => setEditingTeamMember({...editingTeamMember, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Premium Member">Premium Member</option>
                  <option value="Standard Member">Standard Member</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="member-status"
                    checked={editingTeamMember.isActive}
                    onChange={(e) => setEditingTeamMember({...editingTeamMember, isActive: e.target.checked})}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="member-status" className="ml-2 text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setActiveTab('team')}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <CartContext.Provider value={{ cartItems: [], wishlistItems: [] }}>
        <Header 
          user={user}
          onLogout={onLogout}
          onProfileClick={() => setShowProfileModal(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isCompanyDropdownOpen={isCompanyDropdownOpen}
          setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
          companyDropdownRef={companyDropdownRef}
          setCurrentPage={() => {}}
          setShowAuth={() => {}}
          showSecondaryHeader={true}
          secondaryTitle="Brand Owner Dashboard"
          onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
          onPortalClick={handlePortalClick}
        />
      </CartContext.Provider>
      
      {/* Dashboard Header with Menu */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-1xl text-gray-600">
                  Welcome, <span className="font-semibold">{user.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Side Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative flex flex-col w-64 bg-white h-full shadow-xl">
            <div className="flex items-center justify-between p-4">
              <div className="text-lg font-semibold">Menu</div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab('team');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'team' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Manage Team Members
              </button>
              <button
                onClick={() => {
                  setActiveTab('products');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'products' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Manage Products
              </button>
              <button
                onClick={() => {
                  setActiveTab('addproduct');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'addproduct' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Add Product
              </button>
              <button
                onClick={() => {
                  setActiveTab('addaccessory');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'addaccessory' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Add Accessory
              </button>
              <button
                onClick={() => {
                  setActiveTab('ewallet');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'ewallet' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                E-Wallet
              </button>
              <button
                onClick={() => {
                  setActiveTab('incomewallet');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'incomewallet' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Income Wallet
              </button>
              <button
                onClick={() => {
                  setActiveTab('kyc');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'kyc' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                KYC Verification
              </button>
              <button
                onClick={() => {
                  setActiveTab('bank');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'bank' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Add Bank Account
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 py-8">
        {renderTabContent()}
      </div>
      
      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Profile Information</h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Brand Name</label>
                <p className="text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">User ID</label>
                <p className="text-gray-900">{user.userId}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Referral Link</label>
                <div className="flex items-center">
                  <input 
                    type="text" 
                    value={referralLink} 
                    readOnly 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                  <button 
                    onClick={handleCopyReferralLink}
                    className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Share this link to register new users under you</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              <button 
                onClick={() => setShowDeleteConfirmation(false)}
                className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <p>Are you sure you want to remove <span className="font-semibold">{memberToDelete?.name}</span> from your team?</p>
              <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteTeamMember}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modals */}
      {showAddMoneyModal && renderAddMoneyModal()}
      {showPaymentGateway && renderPaymentGateway()}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

// Rest of the components remain the same...
function CustomerRegistration({ onSwitchView, onTreeUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    dateOfBirth: ""
  });
  const [parentInfo, setParentInfo] = useState({ parentId: "", parentName: "" });
  const [isManualParent, setIsManualParent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    updateParentInfo();
  }, []);

  const updateParentInfo = () => {
    const info = treeManager.getNextCustomerParentInfo();
    if (info) {
      setParentInfo({ parentId: info.parentId, parentName: info.parentName });
      setIsManualParent(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleParentIdChange = (e) => {
    const newParentId = e.target.value.trim().toUpperCase();
    setIsManualParent(true);
    
    if (newParentId === "") {
      updateParentInfo();
      return;
    }
    
    const parentNode = treeManager.getUserById(newParentId);
    if (parentNode) {
      setParentInfo({ 
        parentId: newParentId, 
        parentName: parentNode.name 
      });
    } else {
      setParentInfo({ 
        parentId: newParentId, 
        parentName: ""
      });
    }
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    if (!agreeToTerms) {
      setError("Please agree to Terms and Conditions");
      setLoading(false);
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.contact.trim()) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (isManualParent) {
      const parentNode = treeManager.getUserById(parentInfo.parentId);
      if (!parentNode) {
        setError("Invalid Parent ID. Please enter a valid User ID.");
        setLoading(false);
        return;
      }
    }

    try {
      await mockAuth.createUserWithEmailAndPassword(mockFirebaseAuth, formData.email, formData.password);
      
      const result = treeManager.registerCustomer(
        formData.name,
        formData.email,
        formData.password,
        formData.contact,
        formData.dateOfBirth,
        isManualParent ? parentInfo.parentId : null
      );
      
      if (result.success) {
        let message = `Customer Registration Successful!\n\nYour User ID: ${result.userId}\nYour Name: ${formData.name}\n\n`;
        
        if (result.isThirdPlusChild) {
          message += `✅ Registered as DIRECT CHILD of:\n${result.directParentId} - ${result.directParentName}\n(Direct Referral #${treeManager.getUserById(result.directParentId).directReferrals.length})\n\n`;
          message += `📍 Placed in Tree Under:\n${result.placementParentId} - ${result.placementParentName}\nPosition: ${result.position.toUpperCase()}\nYour Level: ${result.level}\n\n`;
          message += `💡 Note: You are a DIRECT child of ${result.directParentName} (receives direct income) but placed in their subtree for tree balance.`;
        } else if (isManualParent) {
          message += `✅ Manually Placed Under:\nParent ID: ${result.directParentId}\nParent Name: ${result.directParentName}\nPosition: ${result.position.toUpperCase()}\nYour Level: ${result.level}`;
        } else {
          message += `🤖 Auto-Placed (BFS) Under:\nParent ID: ${result.directParentId}\nParent Name: ${result.directParentName}\nPosition: ${result.position.toUpperCase()}\nYour Level: ${result.level}`;
        }
        
        alert(message);
        
        if (onTreeUpdate) onTreeUpdate();
        
        setFormData({
          name: "",
          email: "",
          password: "",
          contact: "",
          dateOfBirth: ""
        });
        setAgreeToTerms(false);
        
        setTimeout(updateParentInfo, 500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ENGINEERS</h1>
          <p className="text-gray-600 text-sm">Customer Registration</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Parent ID *</label>
              <input
                className="w-full px-4 py-3 border border-blue-300 rounded-lg bg-white text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                type="text"
                placeholder="Parent ID"
                value={parentInfo.parentId}
                onChange={handleParentIdChange}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Parent Name</label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium"
                type="text"
                placeholder="Auto-filled"
                value={parentInfo.parentName}
                readOnly
              />
            </div>
          </div>

          <div className={`p-3 border rounded-lg text-sm ${
            isManualParent 
              ? 'bg-amber-50 border-amber-300' 
              : 'bg-blue-50 border-blue-300'
          }`}>
            <div className={`font-semibold ${
              isManualParent ? 'text-amber-800' : 'text-blue-800'
            }`}>
              {isManualParent ? "✏️ Manual Parent Selection" : "🤖 Auto-Assigned (BFS Allocation)"}
            </div>
            <div className={`text-xs mt-1 ${
              isManualParent ? 'text-amber-700' : 'text-blue-700'
            }`}>
              {isManualParent 
                ? parentInfo.parentName 
                  ? `You selected: ${parentInfo.parentId} - ${parentInfo.parentName}`
                  : `Validating: ${parentInfo.parentId}...`
                : `Next available: ${parentInfo.parentId} - ${parentInfo.parentName}`}
            </div>
            {isManualParent && (
              <div className="text-xs mt-2 text-amber-600 font-medium">
                💡 For 3+ direct referrals: Enter sponsor's ID - you'll be their DIRECT child, placed in their subtree
              </div>
            )}
          </div>

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="text"
            name="name"
            placeholder="Enter Your Full Name *"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="email"
            name="email"
            placeholder="Enter valid email *"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="password"
            name="password"
            placeholder="Enter password *"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="tel"
            name="contact"
            placeholder="Enter valid contact *"
            value={formData.contact}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
            type="date"
            name="dateOfBirth"
            placeholder="Date of Birth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              Agree to our <span className="text-blue-600 underline cursor-pointer">Terms and Conditions</span>
            </label>
          </div>

          <button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium disabled:opacity-50 transition transform hover:scale-105"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register as Customer"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Want to register as a brand owner?{" "}
          <button
            onClick={() => onSwitchView('brandOwner')}
            className="text-purple-600 hover:underline font-semibold"
          >
            Click here
          </button>
        </p>
      </div>
    </div>
  );
}

function BrandOwnerRegistration({ onSwitchView, onTreeUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    brandName: "",
    businessRegNo: "",
    gstNo: "",
    businessAddress: "",
    gstCertificate: null,
    registrationCertificate: null
  });
  const [parentInfo, setParentInfo] = useState({ parentId: "", parentName: "", willReplace: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    updateParentInfo();
  }, []);

  const updateParentInfo = () => {
    const info = treeManager.getNextBrandOwnerParentInfo();
    if (info) {
      setParentInfo({ 
        parentId: info.parentId, 
        parentName: info.parentName,
        willReplace: !!info.replacingCustomer,
        replacingCustomerInfo: info.replacingCustomer ? {
          id: info.replacingCustomer.id,
          name: info.replacingCustomer.name
        } : null
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    if (!agreeToTerms) {
      setError("Please agree to Terms and Conditions");
      setLoading(false);
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || 
        !formData.contact.trim() || !formData.brandName.trim() || 
        !formData.businessRegNo.trim() || !formData.gstNo.trim() || 
        !formData.businessAddress.trim() || !formData.gstCertificate || !formData.registrationCertificate) {
      setError("All fields are mandatory including Business Address and Business Proof Documents");
      setLoading(false);
      return;
    }

    try {
      await mockAuth.createUserWithEmailAndPassword(mockFirebaseAuth, formData.email, formData.password);
      
      const result = treeManager.registerBrandOwner(
        formData.name,
        formData.email,
        formData.password,
        formData.contact,
        formData.brandName,
        formData.businessRegNo,
        formData.gstNo,
        formData.businessAddress,
        formData.gstCertificate,
        formData.registrationCertificate
      );
      
      if (result.success) {
        let message = `✅ Brand Owner Registration Successful!\n\nYour User ID: ${result.userId}\nYour Name: ${formData.name}\nBrand: ${formData.brandName}\n\n📍 Placed Under (BFS):\nParent ID: ${result.parentId}\nParent Name: ${result.parentName}\nPosition: ${result.position.toUpperCase()}\nYour Level: ${result.level}`;
        
        if (result.replacedCustomer) {
          message += `\n\n🔄 Customer Replaced:\nCustomer ${result.replacedCustomer.customerId} (${result.replacedCustomer.customerName}) was moved under your LEFT leg.\n\n💡 Brand owners earn DIRECT income only (5% on referrals).`;
        } else {
          message += `\n\n💡 Brand owners earn DIRECT income only (5% on referrals).`;
        }
        
        alert(message);
        
        if (onTreeUpdate) onTreeUpdate();
        
        setFormData({
          name: "",
          email: "",
          password: "",
          contact: "",
          brandName: "",
          businessRegNo: "",
          gstNo: "",
          businessAddress: "",
          gstCertificate: null,
          registrationCertificate: null
        });
        setAgreeToTerms(false);
        
        setTimeout(updateParentInfo, 500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ENGINEERS</h1>
          <p className="text-gray-600 text-sm">Brand Owner Registration</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium"
              type="text"
              placeholder="Parent ID"
              value={parentInfo.parentId}
              readOnly
            />
            <input
              className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium"
              type="text"
              placeholder="Parent Name"
              value={parentInfo.parentName}
              readOnly
            />
          </div>

          <div className="p-3 bg-purple-50 border border-purple-300 rounded-lg text-sm">
            <div className="font-semibold text-purple-800">🤖 Auto-Assigned (BFS: Founder/Brand Owner Only)</div>
            <div className="text-purple-700 text-xs mt-1">
              Next placement: {parentInfo.parentId} - {parentInfo.parentName}
            </div>
            {parentInfo.willReplace && parentInfo.replacingCustomerInfo && (
              <div className="mt-2 p-2 bg-amber-100 border border-amber-300 rounded text-xs">
                <div className="font-medium text-amber-800">⚠️ Customer Replacement</div>
                <div className="text-amber-700 mt-1">
                  Customer {parentInfo.replacingCustomerInfo.id} ({parentInfo.replacingCustomerInfo.name}) will be moved under your LEFT leg.
                </div>
              </div>
            )}
            <div className="text-purple-600 text-xs mt-2 font-medium">
              💰 Brand owners earn DIRECT income only (no indirect income)
            </div>
          </div>

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            type="text"
            name="name"
            placeholder="Owner Full Name *"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            type="email"
            name="email"
            placeholder="Business Email *"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            type="password"
            name="password"
            placeholder="Enter password *"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            type="tel"
            name="contact"
            placeholder="Business Contact *"
            value={formData.contact}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            type="text"
            name="brandName"
            placeholder="Brand Name *"
            value={formData.brandName}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            type="text"
            name="businessRegNo"
            placeholder="Business Registration Number *"
            value={formData.businessRegNo}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            type="text"
            name="gstNo"
            placeholder="GST Number *"
            value={formData.gstNo}
            onChange={handleInputChange}
            required
          />

          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            name="businessAddress"
            placeholder="Registered Business Address *"
            value={formData.businessAddress}
            onChange={handleInputChange}
            rows="2"
            required
          />

          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="text-sm font-medium text-gray-700 mb-3">Upload Business Proof *</div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">GST Certificate</label>
                <div className="relative">
                  <input
                    type="file"
                    id="gstCertificate"
                    name="gstCertificate"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                  <div className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm flex items-center justify-between">
                    <span>{formData.gstCertificate ? formData.gstCertificate.name : "Choose file..."}</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Registration Certificate (MSME, UDYAM, or Incorporation)</label>
                <div className="relative">
                  <input
                    type="file"
                    id="registrationCertificate"
                    name="registrationCertificate"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                  <div className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm flex items-center justify-between">
                    <span>{formData.registrationCertificate ? formData.registrationCertificate.name : "Choose file..."}</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms-brand"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
            />
            <label htmlFor="terms-brand" className="text-sm text-gray-700">
              Agree to our <span className="text-purple-600 underline cursor-pointer">Terms and Conditions</span>
            </label>
          </div>

          <button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium disabled:opacity-50 transition transform hover:scale-105"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register as Brand Owner"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Want to register as a customer?{" "}
          <button
            onClick={() => onSwitchView('customer')}
            className="text-purple-600 hover:underline font-semibold"
          >
            Click here
          </button>
        </p>
      </div>
    </div>
  );
}

function TwoFactorAuthSetup({ user, onVerificationSuccess, onSkip, onBackToLogin }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [isValidCode, setIsValidCode] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Validate verification code format
  useEffect(() => {
    // Simple validation: check if code is 6 digits
    if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
      setIsValidCode(true);
    } else {
      setIsValidCode(false);
    }
  }, [verificationCode]);

  const handleSendVerificationCode = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsCodeSent(true);
    setCountdown(60);
    setError("");
    setVerificationCode("");
    
    // In a real app, this would send an actual SMS
    console.log(`Sending verification code to +91 ${phoneNumber}`);
  };

  const handleVerifyCode = () => {
    if (!isValidCode) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    setIsVerifying(true);
    setError("");
    
    // Simulate API call to verify code
    setTimeout(() => {
      // In a real app, this would verify the code with a backend service
      // For demo purposes, we'll accept any 6-digit code
      if (verificationCode.length === 6) {
        onVerificationSuccess();
      } else {
        setError("Invalid verification code. Please try again.");
        setIsVerifying(false);
      }
    }, 1000);
  };

  const handleResendCode = () => {
    if (resendAttempts >= 2) {
      onBackToLogin();
      return;
    }

    setResendAttempts(prev => prev + 1);
    setCountdown(60);
    setError("");
    
    // In a real app, this would resend the SMS
    console.log(`Resending verification code to +91 ${phoneNumber}`);
  };

  const handleChangePhoneNumber = () => {
    setIsPhoneVerified(false);
    setIsCodeSent(false);
    setVerificationCode("");
    setError("");
  };

  const handleSkip = () => {
    setShowSkipModal(true);
  };

  const confirmSkip = () => {
    setShowSkipModal(false);
    onSkip();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl">
        {/*<div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ENGINEERS</h1>
          <p className="text-gray-600 font-semibold text-sm">Welcome to Engineers Ecom Pvt Ltd</p>
        </div>*/}

        <div className="bg-white p-10 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
            Enable Two-Factor Authentication (2FA)
          </h2>

          <p className="text-gray-600 text-sm mb-6 text-center">
            You will be required to enter your password and a verification code every time you sign in.
          </p>

          {!isCodeSent ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Phone Number Verification</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your phone number to receive a verification code.
                </p>
                
                <div className="flex space-x-2">
                  <div className="w-20 px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium flex items-center justify-center">
                    +91
                  </div>
                  <input
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-green-500 rounded hover:from-green-700 hover:to-green-600 transition-all duration-300 ease-in-out hover:scale-105"
                  onClick={handleSendVerificationCode}
                >
                  Get Code
                </button>
                
                <button
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-semibold transition"
                  onClick={handleSkip}
                >
                  Skip Now
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-700">Phone Number Verification</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enter the verification code sent by text to the below phone number:
                </p>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-800">
                    +91 {phoneNumber}
                  </div>
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={handleChangePhoneNumber}
                  >
                    Change
                  </button>
                </div>

                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-center text-lg"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                />
              </div>

              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-gray-600">Didn't receive the code?</span>
                <button
                  className="text-blue-600 hover:underline disabled:text-gray-400"
                  onClick={handleResendCode}
                  disabled={countdown > 0}
                >
                  {countdown > 0 ? `Resend (${countdown}s)` : 'Resend'}
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  className="flex-1 text font-semibold text-white bg-gradient-to-r from-green-600 to-green-500 rounded hover:from-green-700 hover:to-green-600 transition-all duration-300 ease-in-out hover:scale-105"
                  onClick={handleVerifyCode}
                  disabled={!isValidCode || isVerifying}
                >
                  {isVerifying ? "Verifying..." : "Verify"}
                </button>
                
                <button
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-semibold transition"
                  onClick={handleSkip}
                >
                  Skip Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSkipModal && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
  {/* Added 'relative' class to position the button inside */}
  <div className="bg-white p-15 rounded-lg shadow-xl max-w-150 w-150 relative">
    
    {/* Cancel Icon Button */}
    <button
      onClick={() => setShowSkipModal(false)}
      className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 transition-colors focus:outline-none"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <h3 className="text-lg font-medium mb-4">Are you sure you want to skip 2FA?</h3>
    <p className="text-gray-600 mb-6">
      2FA helps keep your account secure, even if your password is compromised.
    </p>
    <div className="flex space-x-3">
      <button
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-semibold transition"
        onClick={() => setShowSkipModal(false)}
      >
        Enabled now
      </button>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
        onClick={confirmSkip}
      >
        Skip for now
      </button>
    </div>
  </div>
</div>
      )}
    </div>
  );
}

// Modified Login component to handle 2FA as a separate view
function Login({ onSwitchView }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await mockAuth.signInWithEmailAndPassword(mockFirebaseAuth, credentials.username, credentials.password);
      
      // Check if user exists in tree manager
      const user = treeManager.getUserById(credentials.username);
      if (!user) {
        setError("Invalid User ID or Password");
        setLoading(false);
        return;
      }
      
      // Navigate to 2FA screen with user data
      onSwitchView('twoFactorAuth', { user });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ENGINEERS</h1>
          <p className="text-gray-600 text-medium">Welcome to Engineers Ecom Pvt Ltd</p>
        </div>

        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">Login</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="text"
            name="username"
            placeholder="User ID"
            value={credentials.username}
            onChange={handleInputChange}
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleInputChange}
          />

          <button
            className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-lg hover:from-gray-800 hover:to-black font-medium disabled:opacity-50 transition transform hover:scale-105"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => onSwitchView('forgot')}
            className="text-sm text-gray-600 hover:text-blue-600 transition"
          >
            Forgot Password?
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Are you not a member yet?{" "}
          <button
            onClick={() => onSwitchView('customer')}
            className="text-blue-600 hover:underline font-semibold"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

function ForgotPassword({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = async () => {
    setLoading(true);
    setMessage("");

    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessage("Password reset instructions have been sent to your email.");
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ENGINEERS</h1>
          <p className="text-gray-600 text-sm">Welcome to Engineers Ecom Pvt Ltd</p>
        </div>

        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">Forgot Password</h2>

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            {message}
          </div>
        )}

        <div className="space-y-6">
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="email"
            placeholder="Enter E-mail address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-lg hover:from-gray-800 hover:to-black font-medium disabled:opacity-50 transition transform hover:scale-105"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <button
            onClick={onBackToLogin}
            className="text-blue-600 hover:underline font-semibold"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

// Customer Portal Manager
class PortalManager {
  constructor() {
    this.portals = new Map();
  }

  createPortal(userId, portalData) {
    this.portals.set(userId, {
      ...portalData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  }

  updatePortal(userId, portalData) {
    if (!this.portals.has(userId)) {
      return { success: false, error: "Portal not found" };
    }
    
    this.portals.set(userId, {
      ...this.portals.get(userId),
      ...portalData,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  }

  getPortal(userId) {
    return this.portals.get(userId) || null;
  }

  getPortalByUrl(url) {
    for (const [userId, portal] of this.portals.entries()) {
      if (portal.url === url) {
        return { userId, portal };
      }
    }
    return null;
  }

  getPortalUrl(userId) {
    const portal = this.portals.get(userId);
    return portal ? portal.url : null;
  }
}

// Initialize the portal manager
const portalManager = new PortalManager();

// Customer Portal Landing Page Component
function CustomerPortalLanding({ portalUrl }) {
  const [portalData, setPortalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState('landing');
  const [params, setParams] = useState({});

  useEffect(() => {
    // Load portal data based on URL
    const portalInfo = portalManager.getPortalByUrl(portalUrl);
    
    if (portalInfo) {
      // Get user data from tree manager
      const userData = treeManager.getUserById(portalInfo.userId);
      
      if (userData) {
        setPortalData({
          ...portalInfo.portal,
          ownerName: userData.name,
          ownerId: portalInfo.userId,
          user: {
            userId: portalInfo.userId,
            name: userData.name,
            email: userData.email,
            userType: userData.userType || 'customer'
          }
        });
      } else {
        setError("Portal owner not found");
      }
    } else {
      setError("Portal not found");
    }
    
    setLoading(false);
  }, [portalUrl]);

  const switchView = (newView, newParams = {}) => {
    setView(newView);
    setParams(newParams);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading portal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Portal Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Render the appropriate view based on the current view state
  switch (view) {
    case 'landing':
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center min-h-screen">
              <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  {portalData.logo && (
                    <img src={portalData.logo} alt="Portal Logo" className="h-12 mr-3" />
                  )}
                  <h1 className="text-3xl font-bold text-gray-800">
                    {portalData.brandName || "ENGINEERS"}
                  </h1>
                </div>
                <p className="text-gray-600 mb-6">{portalData.brandMessage || "Welcome to our customer portal"}</p>
                
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => switchView('register')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition transform hover:scale-105"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => switchView('login')}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition transform hover:scale-105"
                  >
                    Login
                  </button>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-600">
                <p>Powered by ENGINEERS</p>
              </div>
            </div>
          </div>
        </div>
      );
    case 'login':
      return (
        <PortalLogin 
          onSwitchView={switchView} 
          parentInfo={{
            parentId: portalData.ownerId,
            parentName: portalData.ownerName
          }}
          successMessage={params.successMessage}
          isPortal={true}
          portalBrandName={portalData.brandName || "ENGINEERS"}
          portalLogo={portalData.logo}
        />
      );
    case 'register':
      return (
        <PortalRegistration 
          onSwitchView={switchView} 
          parentInfo={{
            parentId: portalData.ownerId,
            parentName: portalData.ownerName
          }}
          isPortal={true}
          portalBrandName={portalData.brandName || "ENGINEERS"}
          portalLogo={portalData.logo}
        />
      );
    case 'customerDashboard':
      return (
        <CustomerDashboard 
          user={params}
          onLogout={() => window.location.href = `/portal/${portalUrl}`}
        />
      );
    default:
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center min-h-screen">
              <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
                <button
                  onClick={() => switchView('landing')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Back to Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      );
  }
}

// Customer Portal Router Component
function CustomerPortalRouter() {
  const [portalUrl, setPortalUrl] = useState("");

  useEffect(() => {
    // Extract portal URL from current path
    const currentPath = window.location.pathname;
    
    // Check if we're on a portal page
    if (currentPath.startsWith('/portal/')) {
      const url = currentPath.replace('/portal/', '');
      if (url) {
        setPortalUrl(url);
      } else {
        // Redirect to home if no portal URL is provided
        window.location.href = '/';
      }
    }
  }, []);

  // Render the CustomerPortalLanding component with the portal URL
  return <CustomerPortalLanding portalUrl={portalUrl} />;
}

// Portal Registration Component
function PortalRegistration({ onSwitchView, parentInfo, isPortal = false, portalBrandName = "", portalLogo = null }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    dateOfBirth: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    if (!agreeToTerms) {
      setError("Please agree to Terms and Conditions");
      setLoading(false);
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.contact.trim()) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      await mockAuth.createUserWithEmailAndPassword(mockFirebaseAuth, formData.email, formData.password);
      
      // For portal registration, always use the portal owner as the parent
      const result = treeManager.registerCustomer(
        formData.name,
        formData.email,
        formData.password,
        formData.contact,
        formData.dateOfBirth,
        parentInfo.parentId
      );
      
      if (result.success) {
        // Send credentials via SMS and email (mock)
        console.log(`Sending credentials to ${formData.contact} and ${formData.email}`);
        
        let message = `Portal Registration Successful!\n\nYour User ID: ${result.userId}\nYour Name: ${formData.name}\n\n`;
        message += `✅ Registered as DIRECT CHILD of:\n${result.directParentId} - ${result.directParentName}\n\n`;
        message += `📍 Placed in Tree Under:\n${result.placementParentId} - ${result.placementParentName}\nPosition: ${result.position.toUpperCase()}\nYour Level: ${result.level}\n\n`;
        message += `💡 Note: You are a DIRECT child of ${result.directParentName} (receives direct income) but placed in their subtree for tree balance.`;
        
        alert(message);
        
        // Redirect to login
        onSwitchView('login', { 
          successMessage: "Registration successful! Please login with your credentials.",
          parentInfo: parentInfo
        });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${!isPortal ? 'flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4' : ''}`}>
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {isPortal && portalLogo && (
              <img src={portalLogo} alt="Portal Logo" className="h-12 mr-3" />
            )}
            <h1 className="text-3xl font-bold text-gray-800">
              {isPortal ? portalBrandName : "ENGINEERS"}
            </h1>
          </div>
          <p className="text-gray-600 text-sm">
            {isPortal ? "Customer Portal Registration" : "Portal Registration"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Parent ID *</label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-medium"
                type="text"
                placeholder="Parent ID"
                value={parentInfo.parentId}
                readOnly
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Parent Name</label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-medium"
                type="text"
                placeholder="Parent Name"
                value={parentInfo.parentName}
                readOnly
              />
            </div>
          </div>

          {isPortal && (
            <div className="p-3 bg-blue-50 border border-blue-300 rounded-lg text-sm">
              <div className="font-semibold text-blue-800">
                🌐 Portal Registration
              </div>
              <div className="text-xs mt-1 text-blue-700">
                You're registering through {parentInfo.parentName}'s portal. You'll be placed as their direct child.
              </div>
            </div>
          )}

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="text"
            name="name"
            placeholder="Enter Your Full Name *"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="email"
            name="email"
            placeholder="Enter valid email *"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="password"
            name="password"
            placeholder="Enter password *"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="tel"
            name="contact"
            placeholder="Enter valid contact *"
            value={formData.contact}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
            type="date"
            name="dateOfBirth"
            placeholder="Date of Birth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              Agree to our <span className="text-blue-600 underline cursor-pointer">Terms and Conditions</span>
            </label>
          </div>

          <button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium disabled:opacity-50 transition transform hover:scale-105"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => onSwitchView('login', { parentInfo: parentInfo })}
            className="text-blue-600 hover:underline font-semibold"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

// Portal Login Component
function PortalLogin({ onSwitchView, parentInfo, successMessage, isPortal = false, portalBrandName = "", portalLogo = null }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await mockAuth.signInWithEmailAndPassword(mockFirebaseAuth, credentials.username, credentials.password);
      
      // Check if user exists in tree manager
      const user = treeManager.getUserById(credentials.username);
      if (!user) {
        setError("Invalid User ID or Password");
        setLoading(false);
        return;
      }
      
      // Redirect to appropriate dashboard based on user type
      if (user.userType === 'customer') {
        onSwitchView('customerDashboard', {
          userId: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType
        });
      } else if (user.userType === 'brand_owner') {
        onSwitchView('customerDashboard', {
          userId: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType
        });
      } else if (user.userType === 'founder') {
        onSwitchView('customerDashboard', {
          userId: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${!isPortal ? 'flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4' : ''}`}>
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {isPortal && portalLogo && (
              <img src={portalLogo} alt="Portal Logo" className="h-12 mr-3" />
            )}
            <h1 className="text-3xl font-bold text-gray-800">
              {isPortal ? portalBrandName : "ENGINEERS"}
            </h1>
          </div>
          <p className="text-gray-600 text-sm">Portal Login</p>
        </div>

        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">Login</h2>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="text"
            name="username"
            placeholder="User ID"
            value={credentials.username}
            onChange={handleInputChange}
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleInputChange}
          />

          <button
            className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-lg hover:from-gray-800 hover:to-black font-medium disabled:opacity-50 transition transform hover:scale-105"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => alert("Password reset functionality would be implemented here")}
            className="text-sm text-gray-600 hover:text-blue-600 transition"
          >
            Forgot Password?
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Are you not a member yet?{" "}
          <button
            onClick={() => onSwitchView('register', { parentInfo: parentInfo })}
            className="text-blue-600 hover:underline font-semibold"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

// Portal View Component (for users accessing a customer's portal)
function PortalView({ portalId, onSwitchView }) {
const [portal, setPortal] = useState(null);
const [loading, setLoading] = useState(true);
const [view, setView] = useState('landing'); // 'landing', 'login', 'registration'

useEffect(() => {
// Find the portal by URL
const portals = Array.from(portalManager.portals.values());
const foundPortal = portals.find(p => p.url === portalId);

if (foundPortal) {
setPortal(foundPortal);
setLoading(false);
} else {
setLoading(false);
}
}, [portalId]);

if (loading) {
return (
<div className="flex items-center justify-center min-h-screen bg-gray-100">
<div className="text-center">
<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
<p className="mt-4 text-gray-600">Loading portal...</p>
</div>
</div>
);
}

if (!portal) {
return (
<div className="flex items-center justify-center min-h-screen bg-gray-100">
<div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
<h1 className="text-2xl font-bold text-gray-800 mb-4">Portal Not Found</h1>
<p className="text-gray-600 mb-6">The portal you're looking for doesn't exist or has been removed.</p>
<button
onClick={() => onSwitchView('login')}
className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
>
Go to Login
</button>
</div>
</div>
);
}

// Get the portal owner's information
const portalOwner = Array.from(treeManager.allNodes.values()).find(node =>
portalManager.portals.has(node.id) && portalManager.portals.get(node.id).url === portalId
);

if (view === 'landing') {
return (
<div className="min-h-screen bg-gray-50">
<header className="bg-white shadow-sm">
<div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
<div className="flex items-center">
{portal.logo ? (
<img src={portal.logo} alt="Logo" className="h-10 mr-4" />
) : (
<div className="h-10 w-10 bg-gray-200 rounded mr-4 flex items-center justify-center">
<span className="text-gray-500 text-xs">No Logo</span>
</div>
)}
<h1 className="text-xl font-bold">{portal.brandName}</h1>
</div>
<div className="flex space-x-4">
<button
onClick={() => setView('login')}
className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
>
Login
</button>
<button
onClick={() => setView('registration')}
className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
>
Register
</button>
</div>
</div>
</header>

<main className="max-w-6xl mx-auto px-4 py-12">
<div className="text-center mb-12">
<h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to {portal.brandName}</h2>
<p className="text-xl text-gray-600 max-w-3xl mx-auto">{portal.brandMessage}</p>
</div>

<div className="grid md:grid-cols-3 gap-8">
<div className="bg-white p-6 rounded-lg shadow-md">
<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
</svg>
</div>
<h3 className="text-lg font-semibold text-center mb-2">Quality Products</h3>
<p className="text-gray-600 text-center">Access our wide range of high-quality products designed to meet your needs.</p>
</div>

<div className="bg-white p-6 rounded-lg shadow-md">
<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
</svg>
</div>
<h3 className="text-lg font-semibold text-center mb-2">Great Earnings</h3>
<p className="text-gray-600 text-center">Join our network and start earning through our referral program.</p>
</div>

<div className="bg-white p-6 rounded-lg shadow-md">
<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
</svg>
</div>
<h3 className="text-lg font-semibold text-center mb-2">Community</h3>
<p className="text-gray-600 text-center">Become part of a growing community of entrepreneurs and customers.</p>
</div>
</div>
</main>

<footer className="bg-gray-800 text-white py-8 mt-12">
<div className="max-w-6xl mx-auto px-4 text-center">
<p>&copy; {new Date().getFullYear()} {portal.brandName}. All rights reserved.</p>
</div>
</footer>
</div>
);
}

if (view === 'login') {
return (
<PortalLogin
onSwitchView={onSwitchView}
parentInfo={{
parentId: portalOwner.id,
parentName: portalOwner.name
}}
/>
);
}

if (view === 'registration') {
return (
<PortalRegistration
onSwitchView={onSwitchView}
parentInfo={{
parentId: portalOwner.id,
parentName: portalOwner.name
}}
/>
);
}
}

// Portal Setup Step 1 Component
function PortalSetupStep1({ onContinue, onBack, parentInfo }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 1: Portal Sign Up and Sign In</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Your Portal Registration Link</h3>
        <div className="flex items-center bg-gray-100 p-4 rounded-lg">
          <input
            type="text"
            value={`${window.location.origin}/portal/${parentInfo.parentId}`}
            readOnly
            className="flex-1 bg-transparent outline-none"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/portal/${parentInfo.parentId}`);
              alert("Link copied to clipboard!");
            }}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Copy Link
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Share this link with others to register as your direct referrals.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Preview of Portal Registration Page</h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Parent ID *</label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-medium"
                type="text"
                value={parentInfo.parentId}
                readOnly
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Parent Name</label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-medium"
                type="text"
                value={parentInfo.parentName}
                readOnly
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 italic">
            The above fields will be pre-filled and non-editable for users registering through your portal.
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// Portal Setup Step 2 Component
function PortalSetupStep2({ onContinue, onBack, portalData, setPortalData }) {
  const [brandName, setBrandName] = useState(portalData.brandName || "");
  const [portalUrl, setPortalUrl] = useState(portalData.url || "");
  const [urlError, setUrlError] = useState("");

  useEffect(() => {
    // Generate portal URL based on brand name
    if (brandName && !portalData.url) {
      const generatedUrl = brandName.toLowerCase().replace(/\s+/g, '-');
      setPortalUrl(generatedUrl);
    }
  }, [brandName, portalData.url]);

  const handleContinue = () => {
    if (!brandName.trim()) {
      alert("Please enter a brand name");
      return;
    }

    if (!portalUrl.trim()) {
      alert("Please enter a portal URL");
      return;
    }

    setPortalData({
      ...portalData,
      brandName,
      url: portalUrl
    });

    onContinue();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 2: Portal Setup</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Enter your brand name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Portal URL</label>
          <div className="flex items-center">
            <span className="px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
              {window.location.origin}/portal/
            </span>
            <input
              type="text"
              value={portalUrl}
              onChange={(e) => {
                setPortalUrl(e.target.value);
                setUrlError("");
              }}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="your-portal-url"
            />
          </div>
          {urlError && <p className="text-red-500 text-sm mt-1">{urlError}</p>}
          <p className="text-sm text-gray-600 mt-2">
            This URL will be used to access your personalized portal.
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Your Portal URL</h3>
          <div className="flex items-center bg-white p-3 rounded-lg">
            <input
              type="text"
              value={`${window.location.origin}/portal/${portalUrl}`}
              readOnly
              className="flex-1 bg-transparent outline-none"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/portal/${portalUrl}`);
                alert("Link copied to clipboard!");
              }}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// Portal Setup Step 3 Component
function PortalSetupStep3({ onContinue, onBack, portalData, setPortalData }) {
  const [logo, setLogo] = useState(portalData.logo || null);
  const [favicon, setFavicon] = useState(portalData.favicon || null);
  const [brandMessage, setBrandMessage] = useState(portalData.brandMessage || "");

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert("Logo size must be less than 500 KB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFavicon(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (!brandMessage.trim()) {
      alert("Please enter a brand message");
      return;
    }

    setPortalData({
      ...portalData,
      logo,
      favicon,
      brandMessage
    });

    onContinue();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 3: Logo and Branding Customization</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo Upload</label>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              {logo ? (
                <img src={logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
            </div>
            <div>
              <input
                type="file"
                id="logo-upload"
                accept="image/png, image/jpg, image/jpeg, image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <label
                htmlFor="logo-upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Choose File
              </label>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG (Max: 500 KB)</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Favicon Upload</label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              {favicon ? (
                <img src={favicon} alt="Favicon" className="w-full h-full object-contain rounded-lg" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
            </div>
            <div>
              <input
                type="file"
                id="favicon-upload"
                accept="image/svg+xml, image/png, image/x-icon"
                onChange={handleFaviconUpload}
                className="hidden"
              />
              <label
                htmlFor="favicon-upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Choose File
              </label>
              <p className="text-xs text-gray-500 mt-1">SVG, PNG, ICO (16×16 pixels)</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand Message</label>
          <textarea
            value={brandMessage}
            onChange={(e) => setBrandMessage(e.target.value)}
            maxLength="250"
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Enter your brand message (max 250 characters)"
          ></textarea>
          <p className="text-xs text-gray-500 mt-1">{brandMessage.length}/250 characters</p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// Portal Setup Step 4 Component
function PortalSetupStep4({ onPublish, onBack, portalData, user }) {
  const handlePublish = () => {
    // Save portal data
    portalManager.createPortal(user.userId, portalData);
    
    // Show success message and redirect to dashboard
    alert("Portal successfully customized!");
    
    // Redirect to customer dashboard
    onPublish();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 4: Preview and Publish</h2>
      
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Portal Preview</h3>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            {portalData.logo ? (
              <img src={portalData.logo} alt="Logo" className="h-12 mr-4" />
            ) : (
              <div className="h-12 w-12 bg-gray-200 rounded mr-4 flex items-center justify-center">
                <span className="text-gray-500 text-xs">No Logo</span>
              </div>
            )}
            <div>
              <h4 className="text-xl font-bold">{portalData.brandName}</h4>
              <p className="text-sm text-gray-600">{portalData.url}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h5 className="font-semibold mb-2">Brand Message:</h5>
            <p className="text-gray-700">{portalData.brandMessage}</p>
          </div>
          
          <div className="mb-4">
            <h5 className="font-semibold mb-2">Portal URL:</h5>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <input
                type="text"
                value={`${window.location.origin}/portal/${portalData.url}`}
                readOnly
                className="flex-1 bg-transparent outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/portal/${portalData.url}`);
                  alert("Link copied to clipboard!");
                }}
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition"
        >
          Back
        </button>
        <button
          onClick={handlePublish}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
        >
          Save and Publish
        </button>
      </div>
    </div>
  );
}

// Manage Customer Portal Component
function ManageCustomerPortal({ user, onLogout, onSwitchToDashboard }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [portalData, setPortalData] = useState(null);
  const [setupStep, setSetupStep] = useState(0);
  const companyDropdownRef = React.useRef(null);
  
  // Get user data from tree manager
  const userData = treeManager.getUserById(user.userId);
  
  // Generate referral link
  const referralLink = `${window.location.origin}/portal/${user.userId}`;
  
  // Load portal data when component mounts
  React.useEffect(() => {
    const portal = portalManager.getPortal(user.userId);
    if (portal) {
      setPortalData(portal);
    }
  }, [user.userId]);
  
  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSetupPortal = () => {
    setSetupStep(1);
  };
  
  const handleSetupStepContinue = () => {
    setSetupStep(prev => prev + 1);
  };
  
  const handleSetupStepBack = () => {
    setSetupStep(prev => prev - 1);
  };
  
  const handlePublishPortal = () => {
    alert("Portal successfully customized!");
    setSetupStep(0);
    // Reload portal data
    const portal = portalManager.getPortal(user.userId);
    if (portal) {
      setPortalData(portal);
    }
    // Redirect to dashboard after publishing
    onSwitchToDashboard();
  };
  
  const handlePreviewPortal = () => {
    // Open the portal in a new tab for preview
    if (portalData) {
      window.open(`${window.location.origin}/portal/${portalData.url}`, '_blank');
    } else {
      alert("Please set up your portal first");
    }
  };
  
  const renderSetupStep = () => {
    switch (setupStep) {
      case 1:
        return (
          <PortalSetupStep1
            onContinue={handleSetupStepContinue}
            onBack={() => setSetupStep(0)}
            parentInfo={{
              parentId: user.userId,
              parentName: user.name
            }}
          />
        );
      case 2:
        return (
          <PortalSetupStep2
            onContinue={handleSetupStepContinue}
            onBack={handleSetupStepBack}
            portalData={portalData || {}}
            setPortalData={setPortalData}
          />
        );
      case 3:
        return (
          <PortalSetupStep3
            onContinue={handleSetupStepContinue}
            onBack={handleSetupStepBack}
            portalData={portalData || {}}
            setPortalData={setPortalData}
          />
        );
      case 4:
        return (
          <PortalSetupStep4
            onPublish={handlePublishPortal}
            onBack={handleSetupStepBack}
            portalData={portalData || {}}
            user={user}
          />
        );
      default:
        return null;
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Customer Portal</h2>
              <button
                onClick={onSwitchToDashboard}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </div>
            
            {portalData ? (
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Portal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Brand Name</span>
                      <p className="font-medium">{portalData.brandName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Portal URL</span>
                      <div className="flex items-center">
                        <p className="font-medium mr-2">{window.location.origin}/portal/{portalData.url}</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/portal/${portalData.url}`);
                            alert("Link copied to clipboard!");
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Last Updated</span>
                      <p className="font-medium">{new Date(portalData.updatedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Created</span>
                      <p className="font-medium">{new Date(portalData.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={() => setSetupStep(1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Portal
                  </button>
                  <button
                    onClick={handlePreviewPortal}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Preview Portal
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Portal Created Yet</h3>
                <p className="text-gray-600 mb-6">Create your personalized portal to start building your brand and expanding your network.</p>
                <button
                  onClick={handleSetupPortal}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Set Up Portal
                </button>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <CartContext.Provider value={{ cartItems: [], wishlistItems: [] }}>
        <Header 
          user={user}
          onLogout={onLogout}
          onProfileClick={() => setShowProfileModal(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isCompanyDropdownOpen={isCompanyDropdownOpen}
          setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
          companyDropdownRef={companyDropdownRef}
          setCurrentPage={() => {}}
          setShowAuth={() => {}}
          showSecondaryHeader={true}
          secondaryTitle="Manage Customer Portal"
          onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </CartContext.Provider>
      
      {/* Dashboard Header with Menu */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-1xl text-gray-600">
                  Welcome, <span className="font-semibold">{user.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Side Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative flex flex-col w-64 bg-white h-full shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-lg font-semibold">Menu</div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <button
                onClick={() => {
                  setActiveTab('overview');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'overview' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Portal Overview
              </button>
              <button
                onClick={() => {
                  onSwitchToDashboard();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 py-8">
        {setupStep > 0 ? (
          <div className="max-w-8xl mx-auto px-4 py-8">
            {renderSetupStep()}
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
      
      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Profile Information</h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                <p className="text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <p className="text-gray-900">{user.userId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Referral Link</label>
                <div className="flex items-center">
                  <input 
                    type="text" 
                    value={referralLink} 
                    readOnly 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                  <button 
                    onClick={handleCopyReferralLink}
                    className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

// Team Portal Data Management Class
class TeamPortalManager {
  constructor() {
    this.teamPortals = new Map();
  }

  createPortal(userId, portalData) {
    this.teamPortals.set(userId, {
      ...portalData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  }

  updatePortal(userId, portalData) {
    if (!this.teamPortals.has(userId)) {
      return { success: false, error: "Portal not found" };
    }
    
    this.teamPortals.set(userId, {
      ...this.teamPortals.get(userId),
      ...portalData,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  }

  getPortal(userId) {
    return this.teamPortals.get(userId) || null;
  }

  getPortalUrl(userId) {
    const portal = this.teamPortals.get(userId);
    return portal ? portal.url : null;
  }
}

// Initialize the team portal manager
const teamPortalManager = new TeamPortalManager();

// Team Portal Setup Step 1 Component
function TeamPortalSetupStep1({ onContinue, parentInfo, onBack }) {
  const [brandName, setBrandName] = useState("");
  const [portalUrl, setPortalUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  useEffect(() => {
    // Generate portal URL based on brand name
    if (brandName) {
      const generatedUrl = brandName.toLowerCase().replace(/\s+/g, '-');
      setPortalUrl(generatedUrl);
    }
  }, [brandName]);

  const handleContinue = () => {
    if (!brandName.trim()) {
      alert("Please enter a brand name");
      return;
    }

    if (!portalUrl.trim()) {
      alert("Please enter a portal URL");
      return;
    }

    onContinue({
      brandName,
      url: portalUrl
    });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Step 1: Setup Team Portal</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Enter your brand name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Portal URL</label>
          <div className="flex items-center">
            <span className="px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
              {window.location.origin}/team-portal/
            </span>
            <input
              type="text"
              value={portalUrl}
              onChange={(e) => {
                setPortalUrl(e.target.value);
                setUrlError("");
              }}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="your-portal-url"
            />
          </div>
          {urlError && <p className="text-red-500 text-sm mt-1">{urlError}</p>}
          <p className="text-sm text-gray-600 mt-2">
            This URL will be used to access your team portal.
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Your Portal URL</h3>
          <div className="flex items-center bg-white p-3 rounded-lg">
            <input
              type="text"
              value={`${window.location.origin}/team-portal/${portalUrl}`}
              readOnly
              className="flex-1 bg-transparent outline-none"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/team-portal/${portalUrl}`);
                alert("Link copied to clipboard!");
              }}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// Team Portal Setup Step 2 Component
function TeamPortalSetupStep2({ onContinue, portalData, setPortalData, onBack }) {
  const [logo, setLogo] = useState(portalData.logo || null);
  const [favicon, setFavicon] = useState(portalData.favicon || null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert("Logo size must be less than 500 KB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFavicon(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    setPortalData({
      ...portalData,
      logo,
      favicon
    });

    onContinue();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 2: Logo and Branding Customization</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo Upload</label>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              {logo ? (
                <img src={logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
            </div>
            <div>
              <input
                type="file"
                id="logo-upload"
                accept="image/png, image/jpg, image/jpeg, image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <label
                htmlFor="logo-upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Choose File
              </label>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG (Max: 500 KB)</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Favicon Upload</label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              {favicon ? (
                <img src={favicon} alt="Favicon" className="w-full h-full object-contain rounded-lg" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
            </div>
            <div>
              <input
                type="file"
                id="favicon-upload"
                accept="image/svg+xml, image/png, image/x-icon"
                onChange={handleFaviconUpload}
                className="hidden"
              />
              <label
                htmlFor="favicon-upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Choose File
              </label>
              <p className="text-xs text-gray-500 mt-1">SVG, PNG, ICO (16×16 pixels)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// Team Portal Setup Step 3 Component
function TeamPortalSetupStep3({ onPublish, portalData, user, onBack }) {
  const handlePublish = () => {
    // Save portal data
    teamPortalManager.createPortal(user.userId, portalData);
    
    // Show success message and redirect to dashboard
    alert("Team portal successfully created!");
    
    // Redirect to brand owner dashboard
    onPublish();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 3: Preview and Publish</h2>
      
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Portal Preview</h3>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            {portalData.logo ? (
              <img src={portalData.logo} alt="Logo" className="h-12 mr-4" />
            ) : (
              <div className="h-12 w-12 bg-gray-200 rounded mr-4 flex items-center justify-center">
                <span className="text-gray-500 text-xs">No Logo</span>
              </div>
            )}
            <div>
              <h4 className="text-xl font-bold">{portalData.brandName}</h4>
              <p className="text-sm text-gray-600">{portalData.url}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h5 className="font-semibold mb-2">Portal URL:</h5>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <input
                type="text"
                value={`${window.location.origin}/team-portal/${portalData.url}`}
                readOnly
                className="flex-1 bg-transparent outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/team-portal/${portalData.url}`);
                  alert("Link copied to clipboard!");
                }}
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition"
        >
          Back
        </button>
        <button
          onClick={handlePublish}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
        >
          Save and Publish
        </button>
      </div>
    </div>
  );
}

// Manage Team Portal Component
function ManageTeamPortal({ user, onLogout, onSwitchToDashboard }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [portalData, setPortalData] = useState(null);
  const [setupStep, setSetupStep] = useState(0);
  const companyDropdownRef = React.useRef(null);

  // Get user data from tree manager
  const userData = treeManager.getUserById(user.userId);
  
  // Generate referral link
  const referralLink = `${window.location.origin}?ref=${user.userId}`;
  
  // Load portal data when component mounts
  React.useEffect(() => {
    const portal = teamPortalManager.getPortal(user.userId);
    if (portal) {
      setPortalData(portal);
    }
  }, [user.userId]);
  
  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSetupPortal = () => {
    setSetupStep(1);
  };
  
  const handleSetupStepContinue = (data) => {
    setPortalData(prev => ({ ...prev, ...data }));
    setSetupStep(prev => prev + 1);
  };
  
  const handleSetupStepBack = () => {
    setSetupStep(prev => Math.max(1, prev - 1));
  };
  
  const handlePublishPortal = () => {
    alert("Team portal successfully created!");
    setSetupStep(0);
    // Reload portal data
    const portal = teamPortalManager.getPortal(user.userId);
    if (portal) {
      setPortalData(portal);
    }
    // Redirect to dashboard after publishing
    onSwitchToDashboard();
  };

  const renderSetupStep = () => {
    switch (setupStep) {
      case 1:
        return (
          <TeamPortalSetupStep1
            onContinue={handleSetupStepContinue}
            onBack={() => setSetupStep(0)}
            parentInfo={{
              parentId: user.userId,
              parentName: user.name
            }}
          />
        );
      case 2:
        return (
          <TeamPortalSetupStep2
            onContinue={handleSetupStepContinue}
            onBack={handleSetupStepBack}
            portalData={portalData || {}}
            setPortalData={setPortalData}
          />
        );
      case 3:
        return (
          <TeamPortalSetupStep3
            onPublish={handlePublishPortal}
            onBack={handleSetupStepBack}
            portalData={portalData || {}}
            user={user}
          />
        );
      default:
        return null;
    }
  };
  
  const renderTabContent = () => {
    // If in setup mode, render setup step
    if (setupStep > 0) {
      return renderSetupStep();
    }
    
    switch (activeTab) {
      case 'overview':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Team Portal</h2>
              <button
                onClick={onSwitchToDashboard}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </div>
            
            {portalData ? (
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Portal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Brand Name</span>
                      <p className="font-medium">{portalData.brandName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Portal URL</span>
                      <div className="flex items-center">
                        <p className="font-medium mr-2">{window.location.origin}/team-portal/{portalData.url}</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/team-portal/${portalData.url}`);
                            alert("Link copied to clipboard!");
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Last Updated</span>
                      <p className="font-medium">{new Date(portalData.updatedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Created</span>
                      <p className="font-medium">{new Date(portalData.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={() => setSetupStep(1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Portal
                  </button>
                  <button
                    onClick={() => window.open(`${window.location.origin}/team-portal/${portalData.url}`, '_blank')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Preview Portal
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Team Portal Created Yet</h3>
                <p className="text-gray-600 mb-6">Create your personalized team portal to start building your brand.</p>
                <button
                  onClick={handleSetupPortal}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Set Up Team Portal
                </button>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <CartContext.Provider value={{ cartItems: [], wishlistItems: [] }}>
        <Header 
          user={user}
          onLogout={onLogout}
          onProfileClick={() => setShowProfileModal(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isCompanyDropdownOpen={isCompanyDropdownOpen}
          setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
          companyDropdownRef={companyDropdownRef}
          setCurrentPage={() => {}}
          setShowAuth={() => {}}
          showSecondaryHeader={true}
          secondaryTitle="Manage Team Portal"
          onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </CartContext.Provider>
      
      {/* Dashboard Header with Menu */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-1xl text-gray-600">
                  Welcome, <span className="font-semibold">{user.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Side Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative flex flex-col w-64 bg-white h-full shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-lg font-semibold">Menu</div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <button
                onClick={() => {
                  setActiveTab('overview');
                  setSetupStep(0);
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  (activeTab === 'overview' && setupStep === 0) 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Portal Overview
              </button>
              <button
                onClick={() => {
                  onSwitchToDashboard();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 py-8">
        {renderTabContent()}
      </div>
      
      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Profile Information</h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                <p className="text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <p className="text-gray-900">{user.userId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Referral Link</label>
                <div className="flex items-center">
                  <input 
                    type="text" 
                    value={referralLink} 
                    readOnly 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                  <button 
                    onClick={handleCopyReferralLink}
                    className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

// Updated AuthApp component to handle 2FA as a separate view
export default function AuthApp() {
  const [currentView, setCurrentView] = useState("login");
  const [treeUpdateTrigger, setTreeUpdateTrigger] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [portalId, setPortalId] = useState(null);
  const [twoFactorAuthUser, setTwoFactorAuthUser] = useState(null);

  // Check if we're accessing a portal URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/portal/')) {
      const id = path.split('/')[2];
      setPortalId(id);
      setCurrentView('portalView');
    }
  }, []);

  const handleTreeUpdate = () => {
    setTreeUpdateTrigger(prev => prev + 1);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setTwoFactorAuthUser(null);
    setCurrentView("login");
  };

  // Global function to switch to customer portal
  useEffect(() => {
    window.switchToCustomerPortal = (user) => {
      setCurrentUser(user);
      setCurrentView('customerDashboard');
    };
    
    window.switchToManagePortal = (user) => {
      setCurrentUser(user);
      setCurrentView('managePortal');
    };
  }, []);

  const handle2FASuccess = () => {
    // Redirect to appropriate dashboard based on user type
    if (twoFactorAuthUser.userType === 'customer') {
      setCurrentUser({
        userId: twoFactorAuthUser.id,
        name: twoFactorAuthUser.name,
        email: twoFactorAuthUser.email,
        userType: twoFactorAuthUser.userType
      });
      setCurrentView('customerDashboard');
    } else if (twoFactorAuthUser.userType === 'brand_owner') {
      setCurrentUser({
        userId: twoFactorAuthUser.id,
        name: twoFactorAuthUser.name,
        email: twoFactorAuthUser.email,
        userType: twoFactorAuthUser.userType,
        brandName: twoFactorAuthUser.brandName
      });
      setCurrentView('brandOwnerDashboard');
    } else if (twoFactorAuthUser.userType === 'founder') {
      setCurrentUser({
        userId: twoFactorAuthUser.id,
        name: twoFactorAuthUser.name,
        email: twoFactorAuthUser.email,
        userType: twoFactorAuthUser.userType
      });
      setCurrentView('customerDashboard');
    }
    setTwoFactorAuthUser(null);
  };

  const handle2FASkip = () => {
    // Redirect to appropriate dashboard based on user type
    if (twoFactorAuthUser.userType === 'customer') {
      setCurrentUser({
        userId: twoFactorAuthUser.id,
        name: twoFactorAuthUser.name,
        email: twoFactorAuthUser.email,
        userType: twoFactorAuthUser.userType
      });
      setCurrentView('customerDashboard');
    } else if (twoFactorAuthUser.userType === 'brand_owner') {
      setCurrentUser({
        userId: twoFactorAuthUser.id,
        name: twoFactorAuthUser.name,
        email: twoFactorAuthUser.email,
        userType: twoFactorAuthUser.userType,
        brandName: twoFactorAuthUser.brandName
      });
      setCurrentView('brandOwnerDashboard');
    } else if (twoFactorAuthUser.userType === 'founder') {
      setCurrentUser({
        userId: twoFactorAuthUser.id,
        name: twoFactorAuthUser.name,
        email: twoFactorAuthUser.email,
        userType: twoFactorAuthUser.userType
      });
      setCurrentView('customerDashboard');
    }
    setTwoFactorAuthUser(null);
  };

  const handleBackToLogin = () => {
    setTwoFactorAuthUser(null);
    setCurrentView("login");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "customer":
        return <CustomerRegistration onSwitchView={setCurrentView} onTreeUpdate={handleTreeUpdate} />;
      case "brandOwner":
        return <BrandOwnerRegistration onSwitchView={setCurrentView} onTreeUpdate={handleTreeUpdate} />;
      case "forgot":
        return <ForgotPassword onBackToLogin={() => setCurrentView("login")} />;
      case "tree":
        return <TreeVisualization key={treeUpdateTrigger} onRunConsolidation={handleTreeUpdate} />;
      case "customerDashboard":
        return <CustomerDashboard user={currentUser} onLogout={handleLogout} />;
      case "brandOwnerDashboard":
        return <BrandOwnerDashboard user={currentUser} onLogout={handleLogout} />;
      case "managePortal":
        return (
          <ManageCustomerPortal 
            user={currentUser} 
            onLogout={handleLogout}
            onSwitchToDashboard={() => {
              setCurrentView('customerDashboard');
            }}
          />
        );
      case "portalView":
        return <PortalView portalId={portalId} onSwitchView={setCurrentView} />;
      case "twoFactorAuth":
        return (
          <TwoFactorAuthSetup
            user={twoFactorAuthUser}
            onVerificationSuccess={handle2FASuccess}
            onSkip={handle2FASkip}
            onBackToLogin={handleBackToLogin}
          />
        );
      default:
        return <Login onSwitchView={(view, data) => {
          if (view === 'twoFactorAuth' && data && data.user) {
            setTwoFactorAuthUser(data.user);
            setCurrentView(view);
          } else if (data) {
            setCurrentUser(data);
            setCurrentView(view);
          } else {
            setCurrentView(view);
          }
        }} />;
    }
  };

  return (
    <div>
      {renderCurrentView()}
      
      {/* Only show navigation bar if not in portal view or 2FA view */}
      {currentView !== 'portalView' && currentView !== 'twoFactorAuth' && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-2xl p-2 flex space-x-2 border-2 border-gray-200 z-50">
          <button
            onClick={() => {
              setCurrentUser(null);
              setTwoFactorAuthUser(null);
              setCurrentView("login");
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentView === "login"
                ? "bg-gray-700 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            🔐 Login
          </button>
          <button
            onClick={() => {
              setCurrentUser(null);
              setTwoFactorAuthUser(null);
              setCurrentView("customer");
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentView === "customer"
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            👤 Customer
          </button>
          <button
            onClick={() => {
              setCurrentUser(null);
              setTwoFactorAuthUser(null);
              setCurrentView("brandOwner");
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentView === "brandOwner"
                ? "bg-purple-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            🏢 Brand
          </button>
          <button
            onClick={() => {
              setCurrentUser(null);
              setTwoFactorAuthUser(null);
              setCurrentView("tree");
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentView === "tree"
                ? "bg-green-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            🌳 Tree
          </button>
        </div>
      )}
    </div>
  );
}
