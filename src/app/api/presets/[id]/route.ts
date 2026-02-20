import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';

const updatePresetSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    type: z.enum(['AGENT', 'SCRAPE']).optional(),
    category: z.enum(['QA Testing', 'Lead Gen', 'Social Media', 'Shopping', 'Monitoring']).optional(),
    icon: z.string().optional(),
    time_estimate: z.string().optional(),
    configuration: z.string().optional(),
    expected_output: z.string().optional(),
});

// GET Single Preset
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { rows } = await query('SELECT * FROM presets WHERE id = $1', [id]);
        if (rows.length === 0) {
            return NextResponse.json({ error: 'Preset not found' }, { status: 404 });
        }
        return NextResponse.json(rows[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE Preset
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

        // Check ownership
        const { rows } = await query('SELECT user_id FROM presets WHERE id = $1', [id]);
        if (rows.length === 0) return NextResponse.json({ error: 'Preset not found' }, { status: 404 });

        if (rows[0].user_id !== payload.sub) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await query('DELETE FROM presets WHERE id = $1', [id]);

        return NextResponse.json({ message: 'Preset deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// UDPATE Preset
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

        // Check ownership
        const { rows } = await query('SELECT user_id FROM presets WHERE id = $1', [id]);
        if (rows.length === 0) return NextResponse.json({ error: 'Preset not found' }, { status: 404 });

        if (rows[0].user_id !== payload.sub) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const result = updatePresetSchema.safeParse(body);

        if (!result.success) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return NextResponse.json({ error: (result.error as any).errors[0].message }, { status: 400 });
        }

        const { title, description, type, category, icon, time_estimate, configuration, expected_output } = result.data;

        // Build dynamic query
        const fields = [];
        const values = [];
        let idx = 1;

        if (title) { fields.push(`title = $${idx++}`); values.push(title); }
        if (description) { fields.push(`description = $${idx++}`); values.push(description); }
        if (type) { fields.push(`type = $${idx++}`); values.push(type); }
        if (category) { fields.push(`category = $${idx++}`); values.push(category); }
        if (icon) { fields.push(`icon = $${idx++}`); values.push(icon); }
        if (time_estimate) { fields.push(`time_estimate = $${idx++}`); values.push(time_estimate); }
        if (expected_output !== undefined) { fields.push(`expected_output = $${idx++}`); values.push(expected_output); }

        // Handle config URL extraction if config changed
        if (configuration) {
            fields.push(`configuration = $${idx++}`);
            values.push(configuration);

            try {
                const config = JSON.parse(configuration);
                if (config.url) {
                    fields.push(`target_url = $${idx++}`);
                    values.push(config.url);
                }
            } catch { }
        }

        if (fields.length === 0) return NextResponse.json({ message: 'No changes' });

        values.push(id);
        const queryStr = `UPDATE presets SET ${fields.join(', ')} WHERE id = $${idx}`;

        await query(queryStr, values);

        return NextResponse.json({ message: 'Preset updated' });

    } catch (error) {
        console.error("Update error", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
