## Backend

**1. HTTP method แต่ละตัวในแอปของคุณหมายถึงอะไร — GET, POST, PUT or PATCH, และ DELETE? ทำไมเราถึงใช้ method ต่างกัน แทนที่จะใช้ POST สำหรับทุกอย่าง?**

GET ใช้ดึงข้อมูลมาแสดง เช่น ดูรายการสินค้าทั้งหมด หรือดูสินค้าชิ้นเดียวตาม id
POST ใช้สร้างสินค้าใหม่ ส่งข้อมูลไปใน body
PUT ใช้แก้ไขสินค้าที่มีอยู่แล้ว โดยระบุ id ที่ต้องการแก้
DELETE ใช้ลบสินค้าออก โดยระบุ id

เราใช้ method ต่างกันเพราะมันบอกให้ server รู้ว่าเราต้องการทำอะไรกับข้อมูล ถ้าใช้ POST หมดมันก็งงว่าเรากำลังสร้างหรือลบ และการดูโค้ดทีหลังก็จะสับสนมากขึ้น

---

**2. `express.json()` คืออะไร และจะเกิดอะไรขึ้นถ้าคุณไม่ใส่มัน?**

`express.json()` เป็น middleware ที่แปลง body ของ request จาก JSON string ให้กลายเป็น JavaScript object เพื่อให้เรา `req.body` แล้วได้ข้อมูลออกมาใช้ได้เลย

ถ้าไม่ใส่ `req.body` จะเป็น `undefined` ทำให้ตอนที่ POST ส่งข้อมูลมา เราก็อ่านข้อมูลไม่ได้เลย ลองตอนแรกโดนปัญหานี้พอดีเพราะลืมใส่

---

**3. `req.body`, `req.params`, และ `req.query` ต่างกันอย่างไร? ยกตัวอย่างจริงจาก API ของคุณสำหรับแต่ละตัว**

`req.body` — ข้อมูลที่ส่งมาใน body ของ request เช่น ตอน POST สร้างสินค้า ฝั่ง React ส่ง `{ name, price, quantity }` มา เราก็ดึงได้ด้วย `req.body`

`req.params` — ข้อมูลที่อยู่ใน URL path เช่น `/products/:id` พอเรียก `/products/123` ก็จะได้ `req.params.id` เท่ากับ `"123"` ใช้ตอนหา แก้ไข หรือลบสินค้าชิ้นเดียว

`req.query` — ข้อมูลที่ต่อท้าย URL หลัง `?` เช่น `/products?name=keyboard` หรือ `/products?sort=price` เราใช้ `req.query.name` และ `req.query.sort` เพื่อกรองและเรียงลำดับสินค้า

---

**4. HTTP status codes คืออะไร? ระบุรายการ status code ทุกตัวที่คุณใช้ใน API และอธิบายว่าทำไมถึงเลือกใช้ในแต่ละสถานการณ์**

Status code คือตัวเลขที่ server ส่งกลับมาพร้อม response เพื่อบอกว่า request สำเร็จหรือมีอะไรผิดพลาด

- **200** — ปกติใช้กับ GET และ PUT, DELETE ที่สำเร็จ บอกว่า "โอเค ทำสำเร็จแล้ว"
- **201** — ใช้กับ POST ที่สร้างสินค้าใหม่สำเร็จ บอกว่า "สร้างของใหม่ให้แล้วนะ"
- **400** — ใช้ตอนที่ข้อมูลที่ส่งมาไม่ถูกต้อง เช่น ไม่มีชื่อสินค้า หรือราคาเป็น string
- **404** — ใช้ตอนหาสินค้าตาม id แล้วไม่เจอ บอกว่า "หาไม่เจอนะ"
- **500** — ใช้ใน error handling middleware สำหรับข้อผิดพลาดที่ไม่คาดคิด

---

**5. middleware คืออะไร? อธิบายด้วยคำพูดของคุณเองว่ามันทำอะไร พร้อมยกตัวอย่าง 1 อย่างจากโค้ดของคุณ**

middleware คือฟังก์ชันที่ทำงานอยู่ระหว่าง request เข้ามากับ response ออกไป เหมือนด่านตรวจที่ request ต้องผ่านทีละด่าน

ในโค้ดผมมี `requestLogger` ที่เขียนเองซึ่งทุก request ที่เข้ามาจะผ่านมันก่อน มันก็แค่ print เวลาและ method กับ URL ออก console เพื่อให้เรารู้ว่ามีอะไร request เข้ามาบ้าง แล้วก็เรียก `next()` เพื่อส่งต่อให้ route ทำงานต่อ

---

**6. ทำไม order ของ middleware ใน Express ถึงสำคัญ? จะเกิดอะไรขึ้นถ้า order ผิด?**

Express รัน middleware ตามลำดับที่เราใส่ `app.use()` จากบนลงล่าง ถ้า order ผิดก็อาจมีปัญหา เช่น ถ้าวาง `express.json()` ไว้หลัง route ที่ใช้ `req.body` ก็จะอ่าน body ไม่ได้เพราะยังไม่ได้ parse

ในโค้ดผมเรียงแบบนี้:
1. `cors()` — เปิดก่อนเลยเพราะทุก request ต้องผ่าน
2. `express.json()` — parse body ก่อนที่ route จะใช้
3. `requestLogger` — log หลังจาก parse แล้ว
4. routes — ตามหลัง middleware ทั้งหมด
5. error handler — ไว้สุดท้ายเสมอ

---

**7. อธิบายทีละขั้นตอนว่าเกิดอะไรขึ้นบน server เมื่อมี POST request ถูกส่งไปที่ `/products`**

1. React ส่ง POST request พร้อม JSON body `{ name, price, quantity }` ไปที่ `http://localhost:3000/products`
2. `cors()` ตรวจว่า origin ยอมรับได้
3. `express.json()` แปลง body จาก JSON string เป็น object แล้วใส่ไว้ใน `req.body`
4. `requestLogger` print log ออก console
5. Express จับคู่ route กับ `app.post('/products', ...)` แล้วเรียก handler
6. handler ดึง `name`, `price`, `quantity` จาก `req.body` แล้ว validate
7. ถ้า validate ผ่าน สร้าง object ใหม่พร้อม `id: String(Date.now())` แล้ว push เข้า array
8. ส่ง response 201 กลับพร้อม object ที่เพิ่งสร้าง

---

**8. CRUD คืออะไร? จับคู่แต่ละ operation กับ HTTP method และ route ที่คุณใช้ใน API**

CRUD คือ 4 action พื้นฐานที่ทำกับข้อมูลได้

- **C**reate → `POST /products` — สร้างสินค้าใหม่
- **R**ead → `GET /products` และ `GET /products/:id` — ดูรายการหรือดูชิ้นเดียว
- **U**pdate → `PUT /products/:id` — แก้ไขสินค้า
- **D**elete → `DELETE /products/:id` — ลบสินค้า

---

**9. API ของคุณตอบสนองอย่างไรเมื่อมีอะไรผิดพลาด — เช่น เมื่อ product ตาม ID ที่ระบุไม่มีอยู่จริง?**

ถ้าหาสินค้าตาม id แล้วไม่เจอใน array ก็จะ return 404 พร้อม JSON `{ error: "Product with id \"123\" not found." }` กลับไป

ถ้าข้อมูลที่ส่งมาไม่ครบหรือผิด เช่น ไม่มี name ก็จะ return 400 พร้อม error message บอกว่า field ไหนมีปัญหา

ส่วน error อื่นที่ไม่คาดคิดจะถูก error handling middleware จับแล้ว return 500 กลับไป

---

## Frontend & Integration

**10. CORS คืออะไร และแก้ปัญหาอะไร? ถ้าไม่ได้ config ไว้บน server ของคุณ คุณจะเห็นอะไรใน browser?**

CORS คือกฎของ browser ที่ไม่ให้หน้าเว็บจาก origin หนึ่งไปเรียก API จาก origin อื่น ในโปรเจกต์นี้ React รันที่ port 5173 และ Express รันที่ port 3000 browser มองว่าเป็นคนละ origin

ถ้าไม่ใส่ `cors()` ใน server จะเห็น error ใน browser ประมาณว่า "CORS policy: No 'Access-Control-Allow-Origin' header" และ fetch จะไม่สำเร็จเลย

---

**11. แอป React ของคุณ fetch ข้อมูลจาก API ที่ไหน? อธิบายว่า `useEffect` ในโค้ดนั้นทำอะไร และทำไมถึงเรียก fetch ตรง ๆ ใน component body ไม่ได้**

fetch อยู่ใน `api.js` ซึ่งรวม URL ทั้งหมดไว้ที่เดียว แล้วใน `App.jsx` มี `useEffect` เรียก `fetchProducts()` ตอน mount

`useEffect` ทำให้ code ข้างในรันหลังจาก component render เสร็จแล้ว ซึ่งเป็นเวลาที่เหมาะสมสำหรับการ fetch

ถ้า fetch ตรงใน component body มันจะรันทุกครั้งที่ component re-render ทำให้เกิด loop ได้ เพราะ fetch เสร็จก็ update state → state เปลี่ยน → render ใหม่ → fetch ใหม่ไม่มีที่สิ้นสุด

---

**12. API base URL ของคุณถูกกำหนดไว้ที่ไหน และทำไมถึงเลือกเก็บไว้ตรงนั้น แทนที่จะ hardcode ไว้ในทุก fetch call?**

เก็บไว้ใน `.env` ที่ root ของ `client/` เป็น `VITE_API_URL=http://localhost:3000` แล้ว `api.js` ดึงมาใช้ด้วย `import.meta.env.VITE_API_URL`

ถ้า hardcode ไว้ทุก fetch call แล้วอยากเปลี่ยน port ก็ต้องไปแก้ทุกที่ ถ้าเก็บใน `.env` แก้ที่เดียวจบ

---

**13. เลือก action หนึ่งในแอปของคุณ — เช่น การลบ product อธิบายการเดินทางแบบครบวงจร (full round trip): เกิดอะไรขึ้นตั้งแต่ผู้ใช้คลิกปุ่ม ไปจนถึง request ไปถึง server จนถึงหน้าจออัปเดตด้วย list ใหม่**

เลือกการลบครับ:

1. ผู้ใช้กดปุ่ม Delete บน product card → browser ถาม confirm
2. ถ้ากด OK ฟังก์ชัน `handleDelete` ใน App.jsx ทำงาน
3. เรียก `deleteProduct(id)` ซึ่งอยู่ใน `api.js` ส่ง `DELETE /products/:id` ไปที่ server
4. Express รับ request หา id ใน array ถ้าเจอก็ splice ออก แล้วส่ง 200 กลับ
5. `api.js` ได้ response กลับมา resolve promise
6. กลับมาที่ `handleDelete` ก็ `setProducts(prev => prev.filter(...))` ลบออกจาก state
7. React re-render ใหม่ list ก็หายไปโดยไม่ต้อง refresh

---

**14. แอปของคุณแสดงอะไรให้ผู้ใช้เห็นระหว่างที่ข้อมูลกำลังโหลด และแสดงอะไรถ้า fetch ล้มเหลว (เช่น server ไม่ได้รันอยู่)? ทำไมเรื่องนี้ถึงสำคัญ?**

ตอนโหลดจะแสดง loading spinner กลางหน้าจอ เพราะมี state `loading` อยู่ ถ้า `loading === true` ก็ render spinner แทน

ถ้า fetch ล้มเหลวจะแสดง error message พร้อมปุ่ม Retry เพราะจับ error จาก catch แล้ว `setError(err.message)`

เรื่องนี้สำคัญเพราะถ้าไม่ทำอะไรเลยผู้ใช้ก็จะเห็นหน้าว่างเปล่าแล้วไม่รู้ว่าเกิดอะไรขึ้น ทำให้ UX แย่มาก

---

**15. หลังจากที่คุณ add, edit, หรือ delete product แล้ว list บนหน้าจอของคุณอัปเดตโดยไม่ต้อง refresh หน้าเว็บ อธิบายว่าทำไมถึงเป็นแบบนั้น — อะไรที่ทำให้ React re-render ด้วยข้อมูลใหม่?**

เพราะเราเก็บ products ไว้ใน state `useState` พอเราเรียก `setProducts(...)` กับ array ใหม่ React จะรู้ว่า state เปลี่ยน แล้วก็ re-render component ใหม่โดยอัตโนมัติ

เราไม่ได้ fetch ใหม่จาก server ทุกครั้ง แต่อัปเดต state ตรง ๆ เลย เช่น ถ้าเพิ่มสินค้า ก็ `setProducts(prev => [...prev, newProduct])` ซึ่งทำให้ list อัปเดตทันที

---

**16. ส่วนไหนที่ยากที่สุดในการเชื่อมแอป React ของคุณเข้ากับ Express API และคุณทำอย่างไรถึงผ่านมันมาได้?**

ยากที่สุดน่าจะเป็นตอน CORS error ครั้งแรก เปิด browser แล้วเห็น error แดงใน console ว่า fetch ไม่ได้เพราะ CORS ตอนแรกไม่รู้ว่า port ต่างกันมันถือว่าต่าง origin

แก้ได้โดย install `cors` package ใน server แล้วใส่ `app.use(cors())` ก่อน routes ทุกอย่างก็ทำงานได้ปกติ

---

## AI Process

**AI Code Contribution Rating: 5**

**17. ถ้าคุณใช้ AI สร้างโค้ด คุณแบ่งงานออกเป็นขั้นตอนหรือ prompt อย่างไร? ยกตัวอย่าง prompt จริงที่คุณใช้ 1 อัน แทนที่จะเป็น prompt เดียวแบบ "สร้างทั้งแอปให้หน่อย"**

ใช้ AI ในการสร้างโครงสร้างหลักของโปรเจกต์ โดยเริ่มจากส่วน backend ก่อน หลังจากนั้นค่อยต่อด้วยส่วน frontend React

ตัวอย่าง prompt ที่ใช้: "สร้าง Express API สำหรับจัดการ products ที่มี CRUD routes ครบ พร้อม custom middleware logger และ error handling middleware โดยเก็บข้อมูลแบบ in-memory array" 

---

**18. อธิบายสิ่งที่ AI tool สร้างให้ 1 อย่างที่คุณเปลี่ยน แก้ไข หรือปฏิเสธ — พร้อมเหตุผลว่าทำไม**

AI สร้าง theme ให้เป็น dark mode glassmorphism มาตอนแรก แต่ผมขอให้เปลี่ยนเป็น light mode แทน เพราะดูแล้วรู้สึกว่า dark mode มันดูเหมือนแอปเกมมากกว่าแอปจัดการสินค้า และ light mode อ่านง่ายกว่าในสภาพแสงปกติ

---

**19. อธิบาย bug หรือ error จริง ๆ ที่คุณเจอระหว่าง build โปรเจกต์นี้ 1 อย่าง คุณหาสาเหตุที่แท้จริงได้อย่างไร นอกเหนือจากการ copy error ไปถามใน chat?**

เจอปัญหา CORS error ตอนที่ React พยายาม fetch ข้อมูลจาก Express ครั้งแรก ดู error ใน browser console เห็นข้อความที่บอกเรื่อง Access-Control-Allow-Origin ก็เลยเปิด Network tab ดูว่า request ถูกส่งไปหรือเปล่า พบว่า request ไปถึง server แต่ browser บล็อก response กลับ ทำให้รู้ว่าต้องแก้ที่ server ไม่ใช่ฝั่ง React

---

**20. เลือก route (backend) หรือ component (frontend) 1 อันที่ AI ช่วยสร้าง โดยไม่ย้อนกลับไปดู AI chat history อธิบายว่ามันทำอะไรและทำไมถึงทำงาน ด้วยคำพูดของคุณเอง**

เลือก `requestLogger` middleware ใน server ครับ

มันเป็นฟังก์ชันที่รับ `req`, `res`, `next` เป็น parameter ทุกครั้งที่มี request เข้ามา มันจะสร้าง timestamp ของเวลาปัจจุบัน แล้ว print ออก console ในรูปแบบ `[เวลา] METHOD URL` เพื่อให้เราเห็นว่ามี request อะไรเข้ามาบ้าง สุดท้ายเรียก `next()` เพื่อส่งต่อให้ middleware หรือ route ถัดไปทำงาน ถ้าไม่เรียก `next()` request จะหยุดอยู่แค่นั้นและไม่ได้ response กลับไป
