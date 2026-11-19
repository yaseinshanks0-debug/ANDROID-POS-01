# تقدير تكاليف Google Cloud — منطقة `europe-west2` (لندن)
# Google Cloud Cost Estimate — ANDROID-POS-01 Multi-Tenant SaaS (Phase 3)

- **مشروع Google Cloud القائم:** `artful-port-r71nt`
- **المنطقة (Region):** `europe-west2` (London — مصنّفة **Tier 2** في تسعير Cloud Run، وتخضع لتسعير لندن في Cloud SQL وCloud Storage)
- **الحجم المستهدف للإطلاق:** 10 شركات، 50 مستخدماً، 20 فرعاً، ~20–35 جهاز POS، مزامنة Offline-First
- **الهدف المالي:** الاستفادة القصوى من الطبقة المجانية (Free Tier) والخدمات الموجودة دون التضحية بأمان وعزل بيانات الشركات
- **تاريخ التقدير:** 2026-11-19

> **ملاحظة شفافية الأسعار (Pricing Verification Note):**
> تم التحقق مباشرة عبر البحث الرسمي من حصص الطبقة المجانية لـ **Cloud Run (`europe-west2` Tier 2)** و**Firebase Authentication / Identity Platform (50,000 MAU مجانية)** و**Cloud Logging (50 GiB/شهر مجانية)**. أما أسعار الساعة/الجيجابايت التفصيلية لـ **Cloud SQL Enterprise (`europe-west2`)** و**Cloud Storage Standard (`europe-west2`)** فهي مستندة إلى تسعيرة Google Cloud المرجعية لمنطقة لندن، ويوصى بتأكيد الأرقام النهائية الدقيقة عبر **Google Cloud Pricing Calculator** باستخدام المعاملات الجاهزة في القسم (5) أدناه.

---

## 1. افتراضات حجم الاستخدام الشهري (10 شركات / 50 مستخدماً / 20 فرعاً)

| المقياس | الافتراض المحافظ (Pilot) | الافتراض النشط (Production) |
| :--- | :---: | :---: |
| عدد الشركات النشطة | 10 شركات | 10 شركات |
| المستخدمون النشطون شهرياً (MAU) | 50 مستخدماً | 50–100 مستخدم |
| عدد الفواتير الشهرية (20 فرعاً × 40–100 فاتورة/يوم) | 24,000 فاتورة/شهر | 60,000 فاتورة/شهر |
| طلبات API الشهرية (مزامنة Delta + مصادقة + تقارير) | ~250,000 طلب/شهر | ~650,000 طلب/شهر |
| حجم قاعدة بيانات PostgreSQL (نص وأرقام بدون صور Base64) | 0.2 – 1.5 GB (حالياً 11 MB) | 2 – 5 GB (سنة أولى) |
| حجم صور المنتجات + إشعارات الدفع + النسخ المشفّرة في GCS | 2 – 5 GB | 10 – 25 GB |
| حجم السجلات الشهرية (Cloud Logging) | < 2 GiB/شهر | < 8 GiB/شهر |

---

## 2. فصل التكاليف (Existing vs Additional vs One-Time vs Monthly)

### أ. التكاليف القائمة حالياً (Existing Costs — موجودة بالفعل في `artful-port-r71nt`)
| الخدمة القائمة | الوضع الحالي | التكلفة الشهرية الحالية التقديرية |
| :--- | :--- | :---: |
| **مشروع Google Cloud (`artful-port-r71nt`)** | مُنشأ ونشط | **$0/شهر** |
| **نسخة Cloud SQL الحالية (Developer Edition — `cloud_sql_development_database`)** | PostgreSQL 18.6، حجم 11 MB، فئة Scale-to-Zero للتطوير (`max_connections=50`) | **$0/شهر** ضمن حصة Developer Free Tier *(تُتحقق الفاتورة الفعلية في Cloud Billing)* |
| **Firebase Auth & Firestore Enterprise (الموجودة)** | المشروع مرتبط بـ Firebase؛ 50 مستخدماً ضمن حد 50,000 MAU المجاني | **$0/شهر** (Spark / Free Tier) |
| **بيئة التطوير الحالية (AI Studio Cloud Run Dev)** | خدمة تطوير مؤقتة (`ais-dev-*`) | مشمولة في بيئة التطوير (لا تُستخدم للإنتاج) |

### ب. التكاليف لمرة واحدة (One-Time Costs)
| البند | الغرض | التكلفة التقديرية |
| :--- | :--- | :---: |
| **اسم نطاق مخصص (Custom Domain — اختياري)** | نطاق مثل `pos.yourdomain.com` لإصدار شهادة TLS مدارة مجانياً من Cloud Run | **$10 – $15/سنة** (أو **$0** باستخدام رابط `*.run.app`) |
| **حساب Google Play Console (اختياري لتوزيع APK)** | نشر تطبيق Android رسمياً على المتجر (بدلاً من التوزيع المباشر APK) | **$25 لمرة واحدة** (أو **$0** بالتوزيع المباشر الداخلي) |
| **إعداد البنية والترحيل البرمجي (تطوير داخلي)** | تطبيق إصلاحات الأمان، RLS، Dockerfile، وGCS | **$0 رسوم GCP إضافية** |

### ج. التكاليف الشهرية الإضافية حسب الخدمة (`europe-west2`)
| الخدمة السحابية | محرك التسعير في `europe-west2` | الطبقة المجانية (Free Tier) | التكلفة الشهرية الإضافية المتوقعة (10 شركات) |
| :--- | :--- | :--- | :---: |
| **Cloud Run (Backend + SPA)** | Request-based billing (`--min-instances=0`, Tier 2 أعلى ~20–40% من Tier 1) | 180,000 vCPU-s + 360,000 GiB-s + 2M طلب/شهر (بحساب مكافئ Tier 1) | **$0 – $3/شهر** (مع `--min-instances=0`) / **~$18–$28/شهر** مع `--min-instances=1` |
| **Cloud SQL (النسخة القائمة)** | **السيناريو A:** إبقاء Developer Edition (Scale-to-Zero). **السيناريو B:** Enterprise `db-f1-micro` (10 GB SSD + Backup + PITR، بدون Public IP أو بـ IP). **السيناريو C:** Enterprise `db-g1-small` أو `db-custom-1-3840` + PITR | Developer Edition يحتوي حصة مجانية؛ Enterprise **بلا Free Tier دائم** | **A:** $0–$5/شهر \| **B:** ~$14–$24/شهر \| **C:** ~$40–$95/شهر |
| **Firebase Authentication** | MAU (بريد إلكتروني/كلمة مرور + Google) | **50,000 MAU مجاناً شهرياً** (بعدها $0.0055/MAU) | **$0/شهر** (50 مستخدماً = 0.1% من الحد المجاني!) |
| **Cloud Storage (`europe-west2`)** | Standard Storage (~$0.023/GB-شهر في لندن) + Class A/B ops + Egress | لا يوجد Free Tier دائم في `europe-west2` (الحصة المجانية 5 GB محصورة بمناطق US فقط) | **$0.15 – $1.00/شهر** (لـ 5–25 GB صور ونسخ مشفّرة) |
| **Cloud Backup & PITR (Cloud SQL)** | تخزين النسخ الآلية (~$0.08–$0.096/GB-شهر في `europe-west2`) + سجلات WAL للـ PITR | ضمن سعة التخزين المدفوعة | **$0.50 – $3.50/شهر** (لـ 7 أيام PITR + 14 نسخة يومية لقاعدة 2–5 GB) |
| **Cloud Logging & Monitoring** | Ingestion بعد 50 GiB/شهر ($0.50/GiB)؛ Monitoring metrics الأساسية مجانية | **50 GiB/شهر مجانية** (احتفاظ 30 يوماً) | **$0/شهر** (الاستهلاك المتوقع < 5 GiB/شهر) |
| **Secret Manager** | $0.06/سر نشط + $0.03 لكل 10k وصول | **أول 6 أسرار + 10,000 وصول مجاناً** | **$0/شهر** (نحتاج 3–4 أسرار فقط تُقرأ عند الإقلاع) |
| **Artifact Registry + Cloud Build** | تخزين صور Docker ($0.10/GB بعد 0.5 GB) + دقائق البناء | **0.5 GB تخزين + 120 دقيقة بناء/يوم مجاناً** | **$0 – $0.20/شهر** (مع سياسة الاحتفاظ بآخر 3 صور فقط) |
| **Networking (تجنّب الفخاخ!)** | الاتصال عبر **Cloud SQL Auth Proxy Socket مجاني**؛ أما **Serverless VPC Connector** فيكلف ~$15+/شهر و**Public IPv4 الخامل** ~$7.30/شهر! | Auth Proxy مدمج مجاني في Cloud Run | **$0/شهر** (بشرط عدم إنشاء VPC Connector أو NAT Gateway!) |

---

## 3. مقارنة السيناريوهات الثلاثة (Monthly Cost Scenarios — `europe-west2`)

### السيناريو A — الحد الأدنى / المجاني قدر الإمكان (`Free / Minimum`)
**المناسب لـ:** اختبارات ما قبل الإطلاق (Staging / Internal QA) أو 1–3 شركات تجريبية غير حرجة زمنياً تقبل إقلاعاً بارداً (Cold Start) لقاعدة البيانات.

| المكون | الإعداد الموصى به | التكلفة القائمة | التكلفة الإضافية | الإجمالي الشهري |
| :--- | :--- | :---: | :---: | :---: |
| Cloud SQL (القائمة) | إبقاء **Developer Edition** (Scale-to-Zero، 10 GB) + تصدير نسخ يومية مشفّرة تلقائياً إلى GCS عبر Cloud Scheduler/Run | $0 | $0 – $5 | **$0 – $5** |
| Cloud Run | 1 خدمة، 512 MiB RAM، 1 vCPU، `--min-instances=0`, `--max-instances=2`, Request-based | $0 | $0 – $1 | **$0 – $1** |
| Firebase Auth | 50 MAU (ضمن 50,000 مجانية) | $0 | $0 | **$0** |
| Cloud Storage (`europe-west2`) | Bucket واحد معزول (2–5 GB للصور والنسخ الاحتياطية اليومية) | $0 | $0.20 – $0.50 | **$0.20 – $0.50** |
| Secret Manager + Logging + Build | ضمن الحصة المجانية (3 أسرار، <2 GiB logs) | $0 | $0 | **$0** |
| **الإجمالي الشهري (السيناريو A)** | **تحذير:** Developer Edition لا يدعم SLA إنتاجي ولا PITR مستمر وقد يستغرق ثواني عند الاستيقاظ من Scale-to-Zero | **$0** | **$0.20 – $6.50** | **$0.20 – $6.50 / شهر** |

---

### السيناريو B — إطلاق تجريبي منخفض التكلفة وآمن (`Low-Cost Pilot` — **الموصى به لـ 10 شركات / 50 مستخدماً**)
**المناسب لـ:** الإطلاق التجاري الفعلي لـ **10 شركات و20 فرعاً و50 مستخدماً** بأمان كامل وعزل RLS ونسخ احتياطي يومي + PITR وأقل فاتورة ممكنة!

| المكون | الإعداد الموصى به | التكلفة القائمة | التكلفة الإضافية | الإجمالي الشهري |
| :--- | :--- | :---: | :---: | :---: |
| Cloud SQL (ترقية النسخة القائمة، بدون إنشاء نسخة ثانية) | ترقية النسخة القائمة إلى **Enterprise `db-f1-micro`** (1 shared vCPU، 614 MB RAM، أو **`db-g1-small`** 1.7 GB RAM عند الحاجة) + **10 GB SSD** + **Automated Daily Backups (14 يوماً) + PITR (7 أيام)**، متصل عبر Auth Proxy Socket (بدون VPC Connector) | $0 | `db-f1-micro`: ~$13–$18 *(أو `db-g1-small`: ~$33–$40)* | **$13 – $22** *(مع `db-f1-micro`)* |
| Cloud Run | 1 خدمة موحدة (API + Frontend)، 512 MiB RAM، 1 vCPU، `--min-instances=0`، `--max-instances=3`، `--concurrency=40` | $0 | $0 – $3 | **$0 – $3** |
| Firebase Auth | 50 MAU (ضمن 50,000 مجانية) | $0 | $0 | **$0** |
| Cloud Storage (`europe-west2`) | 5–10 GB (صور منتجات + إشعارات بنكية + نسخ شركات مشفّرة مع Lifecycle 90 يوماً) | $0 | $0.50 – $1.00 | **$0.50 – $1.00** |
| Cloud Backup / PITR | ~2–5 GB WAL + Backups على Cloud SQL | $0 | $0.50 – $2.00 | **$0.50 – $2.00** |
| Logging + Monitoring + Secret Manager + Artifact Registry | ضمن Free Tier + تنبيهات الميزانية (Budget Alerts) + Uptime Check مجاني | $0 | $0 – $0.50 | **$0 – $0.50** |
| **الإجمالي الشهري (السيناريو B)** | **تكلفة لكل شركة (10 شركات):** **~$1.40 إلى $2.85 شهرياً فقط!** | **$0** | **$14 – $28.50** | **$14 – $28.50 / شهر** |

> **ملاحظة تقنية مهمة لـ `db-f1-micro` مقابل `db-g1-small`:**
> يدعم `db-f1-micro` ~25 اتصالاً متزامناً فقط (مع `--max-instances=3` × `DB_POOL_MAX=5` = 15 اتصالاً كحد أقصى، يكفي لـ 10 شركات و50 مستخدماً بشرط مزامنة Delta لا Snapshots ضخمة!). إذا لاحظت ضغطاً في الذاكرة أثناء تقارير التحليلات الثقيلة، فالترقية إلى `db-g1-small` (1.7 GB RAM، ~50 اتصالاً) ترفع الإجمالي إلى **~$35 – $48/شهر** (~$3.5–$4.8 لكل شركة).

---

### السيناريو C — إنتاجي عالي الاعتمادية (`Production-Ready`)
**المناسب لـ:** التوسع فوق 10–50 شركة، تقارير BI متزامنة ثقيلة، بدون Cold Start (زمن استجابة فوري للكاشير)، واستمرارية أعمال عالية.

| المكون | الإعداد الموصى به | التكلفة القائمة | التكلفة الإضافية | الإجمالي الشهري |
| :--- | :--- | :---: | :---: | :---: |
| Cloud SQL (النسخة القائمة بعد الترقية) | **Enterprise `db-custom-1-3840`** (1 Dedicated vCPU، 3.75 GB RAM، Single-Zone؛ وللـ HA مضاعفة السعر) + **20 GB SSD** + Automated Backups (30 يوماً) + PITR (7 أيام) | $0 | ~$65 – $78 *(Single-Zone)* \| ~$130–$155 *(HA Regional)* | **$65 – $78** *(Single-Zone)* |
| Cloud Run | 1 خدمة، 1 GiB RAM، 1 vCPU، **`--min-instances=1`** (صفر Cold Start)، `--max-instances=5` | $0 | ~$18 – $28 | **$18 – $28** |
| Firebase Auth | 50–1,000 MAU (ضمن 50,000 مجانية) | $0 | $0 | **$0** |
| Cloud Storage (`europe-west2`) | 20–30 GB Standard + Versioning + Object Lifecycle (Nearline بعد 60 يوماً) | $0 | $1.00 – $2.50 | **$1.00 – $2.50** |
| Cloud Backup / PITR | 10–20 GB Backups + WAL logs | $0 | $2.00 – $5.00 | **$2.00 – $5.00** |
| Logging + Monitoring + Cloud Scheduler + Secret Manager + Artifact Registry | لوحات مراقبة + تنبيهات Latency/5xx + مهام نسخ مجدولة | $0 | $1.00 – $3.00 | **$1.00 – $3.00** |
| **الإجمالي الشهري (السيناريو C)** | استجابة فورية بدون Cold Start ومعالج مخصص لقاعدة البيانات | **$0** | **$87 – $116.50** | **$87 – $116.50 / شهر** *(أو ~$155–$195 مع HA)* |

---

## 4. كيف نصل إلى أقل تكلفة ممكنة دون التضحية بأمان بيانات الشركات؟

| القاعدة الذهبية | ما الذي توفره شهرياً؟ | لماذا لا تضر بالأمان؟ |
| :--- | :---: | :--- |
| **1. عدم إنشاء Serverless VPC Access Connector** والاعتماد على **Cloud SQL Auth Proxy Unix Socket** المدمج في Cloud Run | يوفر **~$15 – $30/شهر** | النفق مشفّر بالكامل بـ TLS ومصادق بـ IAM Service Account دون فتح أي منفذ عام على الإنترنت. |
| **2. خدمة Cloud Run واحدة (Monolith: Express API + Vite Static `dist/`)** مع `--min-instances=0` و`--max-instances=3` | يوفر **~$20 – $40/شهر** | لأن تطبيق POS يعمل **Offline-First** (SQLite/IndexedDB محلياً)، فلن يتأثر الكاشير بـ 1–2 ثانية Cold Start أثناء المزامنة الخلفية! وسقف `--max-instances=3` يمنع انفجار الفاتورة عند أي هجوم. |
| **3. قاعدة بيانات مشتركة واحدة (Shared DB) مع PostgreSQL RLS + `company_id`** بدلاً من Cloud SQL لكل شركة | يوفر **~$150 – $600/شهر** (بدل 10 قواعد!) | مع `ENABLE + FORCE ROW LEVEL SECURITY` + دور تطبيق مقيّد + `SET LOCAL app.current_company_id`، يُمنع تسرب البيانات على مستوى محرك PostgreSQL نفسه. |
| **4. نقل صور المنتجات والإشعارات البنكية من Base64 إلى Cloud Storage عبر Signed URLs** | يوفر **70–90% من مساحة SSD وRAM** في Cloud SQL | يحافظ على صغر حجم قاعدة البيانات (تبقى < 2 GB لسنوات)، ويمنع استهلاك الذاكرة أثناء النسخ الاحتياطي والمزامنة. |
| **5. حصر Firebase في Authentication فقط** وإيقاف مزامنة لقطات المتجر الكاملة عبر Firestore | يوفر تكاليف قراءة/كتابة Firestore وتجاوز الحصة | يمنع تضارب مصادر الحقيقة وحد 1 MB للمستند، ويبقي Firebase Auth مجانياً بالكامل حتى 50,000 مستخدم نشط شهرياً. |
| **6. ضبط Budget Alerts (50% / 80% / 100%) + سياسة تنظيف Artifact Registry (آخر 3 صور) + تقليص حجم السجلات** | يمنع أي مفاجآت فوترة | يضمن بقاء Cloud Logging وSecret Manager وCloud Build عند **$0/شهر**. |

---

## 5. ورقة التحقق عبر Google Cloud Pricing Calculator (`europe-west2`)

للتحقق الفوري من السعر الدقيق على الرابط الرسمي: `https://cloud.google.com/products/calculator` — أدخل المكونات التالية بالضبط:

1. **Cloud SQL for PostgreSQL**
   - Region: `London (europe-west2)`
   - Edition: `Enterprise`
   - Machine type: `db-f1-micro` (السيناريو B) أو `db-g1-small` أو `db-custom-1-3840` (السيناريو C)
   - Availability: `Zonal (Single Zone)` (لـ B/C)
   - Storage: `10 GB SSD` (لـ B) أو `20 GB SSD` (لـ C)
   - Automated backups: `5 GB` + Point-in-time recovery (PITR): `Enabled (7 days)`
2. **Cloud Run**
   - Region: `London (europe-west2)` (Tier 2)
   - Billing model: `Request-based`
   - vCPU: `1` | Memory: `0.5 GiB` (لـ B) | Min instances: `0` (لـ B) أو `1` (لـ C)
   - Requests/month: `300,000` | Avg execution time: `150 ms` | Concurrency: `40`
3. **Cloud Storage**
   - Location type: `Region` | Region: `London (europe-west2)`
   - Storage class: `Standard` | Amount: `10 GB`
   - Class A ops: `50,000/month` | Class B ops: `200,000/month` | Internet Egress: `10 GB/month`
4. **Firebase Auth / Identity Platform**: `50 MAU` (Free Tier = `$0.00`)
5. **Cloud Logging**: `5 GiB/month` (Free Tier 50 GiB = `$0.00`)
6. **Secret Manager**: `4 active secret versions`, `5,000 accesses/month` (Free Tier = `$0.00`)
