import type { APIRoute } from 'astro';
import { db } from '../../db';
import { savingsGoals, transactions } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '../../lib/auth';

export const GET: APIRoute = async (context) => {
  try {
    const session = await auth.api.getSession({
      headers: context.request.headers
    });
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userId = session.user.id;

    const list = await db.select().from(savingsGoals).where(eq(savingsGoals.userId, userId));
    
    return new Response(JSON.stringify(list), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async (context) => {
  try {
    const session = await auth.api.getSession({
      headers: context.request.headers
    });
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userId = session.user.id;
    const body = await context.request.json();
    const { title, targetAmount, deadline } = body;

    const newId = `s_${Date.now()}`;
    const newGoal = {
      id: newId,
      userId: userId,
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      deadline
    };

    await db.insert(savingsGoals).values(newGoal);

    return new Response(JSON.stringify({ success: true, goal: newGoal }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async (context) => {
  try {
    const session = await auth.api.getSession({
      headers: context.request.headers
    });
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userId = session.user.id;
    const body = await context.request.json();
    const { id, amount, title, targetAmount, deadline, currentAmount } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Valid goal ID is required' }), { status: 400 });
    }

    // Find the goal and verify it belongs to this user
    const existing = await db.select().from(savingsGoals).where(and(eq(savingsGoals.id, id), eq(savingsGoals.userId, userId)));
    if (existing.length === 0) {
      return new Response(JSON.stringify({ error: 'Savings goal not found' }), { status: 404 });
    }

    const goal = existing[0];

    // If amount is provided, perform a deposit allocation
    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return new Response(JSON.stringify({ error: 'Valid deposit amount is required' }), { status: 400 });
      }

      const updatedAmount = goal.currentAmount + parsedAmount;

      // 1. Update savings goal current amount
      await db.update(savingsGoals).set({
        currentAmount: updatedAmount
      }).where(eq(savingsGoals.id, id));

      // 2. Automatically write a transaction log for savings allocation
      const autoTxId = Date.now().toString();
      const autoTx = {
        id: autoTxId,
        userId: userId,
        nominal: parsedAmount,
        kategori: 'Tabungan',
        tanggal: new Date().toISOString().split('T')[0],
        catatan: `Alokasi Tabungan: ${goal.title}`,
        tipe: 'pengeluaran' // deducts from current active balances
      };

      await db.insert(transactions).values(autoTx);

      return new Response(JSON.stringify({ success: true, currentAmount: updatedAmount }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Otherwise, perform a standard metadata update (CRUD Edit)
    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (targetAmount !== undefined) updateData.targetAmount = parseFloat(targetAmount);
    if (deadline !== undefined) updateData.deadline = deadline;
    if (currentAmount !== undefined) updateData.currentAmount = parseFloat(currentAmount);

    await db.update(savingsGoals).set(updateData).where(eq(savingsGoals.id, id));

    const updatedGoal = {
      ...goal,
      ...updateData
    };

    return new Response(JSON.stringify({ success: true, goal: updatedGoal }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async (context) => {
  try {
    const session = await auth.api.getSession({
      headers: context.request.headers
    });
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userId = session.user.id;
    
    // Parse ID from URL query params
    const url = new URL(context.request.url);
    let id = url.searchParams.get('id');

    // Alternatively parse from JSON body if not in query
    if (!id) {
      try {
        const body = await context.request.json();
        id = body.id;
      } catch (e) {
        // ignore parse errors
      }
    }

    if (!id) {
      return new Response(JSON.stringify({ error: 'Goal ID is required' }), { status: 400 });
    }

    // Check if it belongs to user
    const existing = await db.select().from(savingsGoals).where(and(eq(savingsGoals.id, id), eq(savingsGoals.userId, userId)));
    if (existing.length === 0) {
      return new Response(JSON.stringify({ error: 'Savings goal not found or unauthorized' }), { status: 404 });
    }

    // Delete the savings goal
    await db.delete(savingsGoals).where(eq(savingsGoals.id, id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

