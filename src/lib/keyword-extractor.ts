/**
 * Ekstraktor Kata Kunci & Pembuat Query PostgreSQL Full-Text Search
 *
 * Mengambil kata kunci signifikan dari judul, tag, dan ringkasan artikel
 * dengan menyaring stopwords bahasa Indonesia dan Inggris.
 */

const STOP_WORDS = new Set([
  // Indonesian Stopwords
  'yang', 'untuk', 'pada', 'ke', 'para', 'namun', 'menurut', 'antara', 'dia', 'dua',
  'ia', 'seperti', 'jika', 'sehingga', 'kembali', 'dan', 'tidak', 'ini', 'karena',
  'kepada', 'oleh', 'saat', 'harus', 'sementara', 'setelah', 'belum', 'kami', 'sekitar',
  'bagi', 'serta', 'di', 'dari', 'telah', 'sebagai', 'masih', 'hal', 'ketika', 'adalah',
  'itu', 'dalam', 'bisa', 'bahwa', 'atau', 'hanya', 'kita', 'dengan', 'akan', 'juga',
  'ada', 'mereka', 'sudah', 'saya', 'terhadap', 'secara', 'agar', 'lain', 'anda',
  'begitu', 'mengapa', 'kenapa', 'bagaimana', 'apa', 'apakah', 'siapa', 'kapan', 'mana',
  'dimana', 'saja', 'pun', 'lebih', 'paling', 'sangat', 'banyak', 'sedikit', 'semua',
  'setiap', 'suatu', 'sebuah', 'menjadi', 'tersebut', 'bukan', 'tentang', 'hingga',
  'sampai', 'dapat', 'maka', 'lalu', 'kemudian', 'bahkan', 'supaya', 'tentu', 'cukup',
  'selalu', 'sering', 'pernah', 'biasa', 'sedang', 'jangan', 'hampir',

  // English Stopwords
  'the', 'and', 'in', 'to', 'of', 'for', 'with', 'on', 'at', 'from', 'by', 'about',
  'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against', 'during',
  'without', 'before', 'under', 'around', 'among', 'is', 'are', 'was', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'can', 'could', 'will',
  'would', 'should', 'this', 'that', 'these', 'those', 'it', 'its', 'you', 'your',
  'we', 'our', 'they', 'their', 'how', 'why', 'what', 'when', 'where', 'which', 'who',
  'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
  'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'now',
]);

export interface KeywordExtractionResult {
  keywords: string[];
  toTsQueryString: string;
}

/**
 * Membersihkan dan mengekstrak kata kunci berbobot dari komponen teks artikel.
 * Mengutamakan kata-kata pada Judul dan Tag dibanding Excerpt.
 */
export function extractArticleKeywords({
  title = '',
  excerpt = '',
  tagNames = [],
  maxKeywords = 8,
}: {
  title?: string;
  excerpt?: string;
  tagNames?: string[];
  maxKeywords?: number;
}): KeywordExtractionResult {
  const seen = new Set<string>();
  const keywords: string[] = [];

  // Helper untuk tokenisasi dan pembersihan kata
  const addWord = (raw: string) => {
    // Hanya izinkan karakter alfanumerik (a-z, 0-9)
    const cleaned = raw
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .trim();

    // Syarat kata kunci: panjang minimal 3 karakter, bukan stopword, dan belum pernah dicatat
    if (cleaned.length >= 3 && !STOP_WORDS.has(cleaned) && !seen.has(cleaned)) {
      // Abaikan jika hanya berupa angka murni (misal '2026', '100')
      if (/^\d+$/.test(cleaned)) return;
      seen.add(cleaned);
      keywords.push(cleaned);
    }
  };

  // 1. Prioritas 1: Tag editorial (sangat spesifik, misal 'postgresql', 'docker', 'concurrency')
  for (const tag of tagNames) {
    const parts = tag.split(/[\s-_]+/);
    for (const p of parts) addWord(p);
  }

  // 2. Prioritas 2: Judul artikel (membawa intisari topik)
  const titleTokens = title.split(/[\s\-_:,./\\()[\]{}'"`!?;]+/);
  for (const token of titleTokens) {
    addWord(token);
  }

  // 3. Prioritas 3: Excerpt (melengkapi konteks jika kata kunci masih kurang dari batas)
  if (keywords.length < maxKeywords) {
    const excerptTokens = excerpt.split(/[\s\-_:,./\\()[\]{}'"`!?;]+/);
    for (const token of excerptTokens) {
      if (keywords.length >= maxKeywords) break;
      addWord(token);
    }
  }

  const selectedKeywords = keywords.slice(0, maxKeywords);

  // Buat query string yang aman untuk PostgreSQL to_tsquery('simple', ...)
  // Format: 'word1 | word2 | word3'
  const toTsQueryString = selectedKeywords.length > 0
    ? selectedKeywords.join(' | ')
    : '';

  return {
    keywords: selectedKeywords,
    toTsQueryString,
  };
}
