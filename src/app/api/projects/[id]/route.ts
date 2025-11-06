import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: 'ID do projeto é obrigatório.' }, { status: 400 });
    }

    const pool = getDbPool();
    const { rows } = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Projeto não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Falha ao buscar projeto:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}