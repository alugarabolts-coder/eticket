# Panduan Database ShipTix

## Update Data Schedules

### ⚠️ PENTING: Format Kolom `classes`

Kolom `classes` di tabel `schedules` bertipe **JSONB**. Saat melakukan UPDATE, pastikan menggunakan format JSON yang valid.

### Format yang BENAR ✅

Jika update melalui Supabase SQL Editor atau pgAdmin:

```sql
UPDATE schedules
SET classes = '[
  {"class": "Economy", "price": 350000, "available_seats": 600},
  {"class": "Business", "price": 550000, "available_seats": 200},
  {"class": "VIP", "price": 850000, "available_seats": 50}
]'::jsonb
WHERE id = 'c96d109e-a033-4598-a012-200948924ed5';
```

Atau format alternatif:

```sql
UPDATE schedules
SET classes = jsonb_build_array(
  jsonb_build_object('class', 'Economy', 'price', 350000, 'available_seats', 600),
  jsonb_build_object('class', 'Business', 'price', 550000, 'available_seats', 200),
  jsonb_build_object('class', 'VIP', 'price', 850000, 'available_seats', 50)
)
WHERE id = 'c96d109e-a033-4598-a012-200948924ed5';
```

### Format yang SALAH ❌

```sql
-- JANGAN gunakan format ini:
UPDATE schedules
SET classes = [object Object],[object Object],[object Object]
WHERE id = 'xxx';
```

### Update Melalui JavaScript/TypeScript

```typescript
// BENAR ✅
await supabase
  .from('schedules')
  .update({
    classes: [
      { class: 'Economy', price: 350000, available_seats: 600 },
      { class: 'Business', price: 550000, available_seats: 200 },
      { class: 'VIP', price: 850000, available_seats: 50 }
    ]
  })
  .eq('id', scheduleId);

// SALAH ❌ - Jangan stringify manual
await supabase
  .from('schedules')
  .update({
    classes: JSON.stringify([...]) // JANGAN lakukan ini
  })
  .eq('id', scheduleId);
```

## Contoh Data Schedules

```json
{
  "id": "c96d109e-a033-4598-a012-200948924ed5",
  "ship_id": "uuid",
  "departure_port_id": "uuid",
  "arrival_port_id": "uuid",
  "departure_time": "2025-10-20T13:46:31.763209+00:00",
  "arrival_time": "2025-10-21T07:46:31.763209+00:00",
  "duration_minutes": 1080,
  "classes": [
    {
      "class": "Economy",
      "price": 350000,
      "available_seats": 600
    },
    {
      "class": "Business",
      "price": 550000,
      "available_seats": 200
    },
    {
      "class": "VIP",
      "price": 850000,
      "available_seats": 50
    }
  ],
  "status": "scheduled"
}
```

## Memperbaiki Data yang Corrupt

Jika data `classes` sudah corrupt, perbaiki dengan query berikut:

```sql
-- Cek data yang bermasalah
SELECT id, classes FROM schedules WHERE classes IS NULL OR classes::text = '[]';

-- Perbaiki dengan data default
UPDATE schedules
SET classes = '[
  {"class": "Economy", "price": 350000, "available_seats": 600},
  {"class": "Business", "price": 550000, "available_seats": 200},
  {"class": "VIP", "price": 850000, "available_seats": 50}
]'::jsonb
WHERE id = 'MASUKKAN_ID_YANG_BERMASALAH';
```

## Tips

1. Selalu gunakan Supabase client library untuk update data dari aplikasi
2. Jika menggunakan SQL Editor, pastikan format JSON valid
3. Test query SELECT dulu sebelum melakukan UPDATE
4. Backup data penting sebelum melakukan UPDATE mass data
