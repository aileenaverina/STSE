import os
import psycopg2
import psycopg2.extras
from flask_cors import CORS
from flask import Flask, jsonify, request
app = Flask(__name__)
CORS(app)

def get_db_connection():
    return psycopg2.connect(
        host="103.27.206.131" ,
        database="4angle_movie",
        user="stse",
        password="ubaya",
        port="5433"
    )

@app.route("/")
def home():
    return "<h1>Halo ini backend</h1>"

SORTS = {
    "rating_desc": "rating DESC NULLS LAST, id",
    "rating_asc":  "rating ASC NULLS LAST, id",
}
DEFAULT_SORT = "release_date DESC NULLS LAST, id"


@app.route("/movies")
def movies():
    per_page = 24
    page = max(request.args.get("page", 1, type=int), 1)
    search = request.args.get("search", "").strip()
    genre = request.args.get("genre", "").strip()
    year = request.args.get("year", type=int)
    order_sql = SORTS.get(request.args.get("sort", ""), DEFAULT_SORT)

    # susun WHERE hanya untuk filter yang diisi
    where, params = [], []
    if search:
        where.append("title ILIKE %s")
        params.append(f"%{search}%")
    if genre:
        where.append("genres ILIKE %s")
        params.append(f"%{genre}%")
    if year:
        where.append("EXTRACT(YEAR FROM release_date) = %s")
        params.append(year)
    where_sql = ("WHERE " + " AND ".join(where)) if where else ""

    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # total film keseluruhan (untuk menghitung jumlah halaman)
    cur.execute(f"SELECT COUNT(*) AS total FROM movies {where_sql}", params)
    total = cur.fetchone()["total"]

    # data untuk halaman ini saja
    cur.execute(f"""
        SELECT id, title, release_date, rating, poster_url, genres,
               LEFT(overview, 200) AS overview
        FROM movies
        {where_sql}
        ORDER BY {order_sql}
        LIMIT %s OFFSET %s
    """, params + [per_page, (page - 1) * per_page])
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify({
        "page": page,
        "per_page": per_page,
        "total": total,
        "total_pages": -(-total // per_page),   # pembulatan ke atas
        "data": rows,
    })


@app.route("/filters")
def filters():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT DISTINCT EXTRACT(YEAR FROM release_date)::int AS y
        FROM movies
        WHERE release_date IS NOT NULL
        ORDER BY y DESC
    """)
    years = [r[0] for r in cur.fetchall()]

    # genres TEXT tersimpan seperti string list Python, mis. "['adventure', 'horor', 'misteri']"
    cur.execute("""
        SELECT DISTINCT genre
        FROM movies, regexp_split_to_table(genres, '[^a-zA-Z]+') AS genre
        WHERE genre <> ''
        ORDER BY genre
    """)
    genres = [r[0] for r in cur.fetchall()]

    cur.close()
    conn.close()
    return jsonify({"years": years, "genres": genres})

# Menampilkan detail satu movie berdasarkan ID pada URL
@app.route("/movies/<int:movie_id>", methods=["GET"])
def movie_detail(movie_id):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # Mengambil seluruh informasi movie berdasarkan id
    cur.execute("""
        SELECT *
        FROM movies
        WHERE id = %s
    """, (movie_id,))
    movie = cur.fetchone()

    cur.close()
    conn.close()

    # Jika id movie tidak ditemukan
    if movie is None:
        return jsonify({
            "message": "Movie tidak ditemukan"
        }), 404

    # Mengembalikan detail movie dalam format JSON
    return jsonify({
        "data": movie
    }), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000,debug=True)
