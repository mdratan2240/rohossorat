রহস্যরাত — SEO update review notes

এই পরিবর্তনগুলো আলাদা seo-fixes-review branch-এ প্রস্তুত করা হয়েছে; main branch বা Production deploy পরিবর্তন করা হয়নি।

বর্তমান সাইটে:
- প্রকাশিত গল্পের কার্ড /story/FIRESTORE_DOCUMENT_ID লিংক ব্যবহার করে।
- গল্প খোলার সময় browser title, meta description, canonical URL, Open Graph এবং Article JSON-LD আপডেট হয়।
- Netlify _redirects /story/* ঠিকানাকে index.html-এ পাঠায়।
- Admin panel, Firebase rules এবং গল্প প্রকাশের কোড এই পরিবর্তনে সম্পাদনা করা হয়নি।

এই প্রস্তাবে:
- netlify/functions/sitemap.mjs শুধু published=true Firestore documents পড়ে homepage ও প্রকাশিত গল্পগুলোর XML sitemap তৈরি করে।
- /sitemap.xml-কে Netlify Function-এ পাঠাতে force rewrite ব্যবহার করা হয়েছে, যাতে repository-তে থাকা পুরোনো static sitemap.xml rewrite-কে shadow না করে।
- Firebase API key source code-এ রাখা হয়নি। Netlify environment variable FIREBASE_API_KEY সেট না থাকলে function স্পষ্ট 503 দেবে।

Deploy-এর আগে আবশ্যক:
1. Netlify site-এর environment variables-এ FIREBASE_API_KEY যোগ করুন। এর মান বর্তমান index.html-এর Firebase web config-এর apiKey মানের সঙ্গে মিলতে হবে।
2. Deploy Preview-তে /sitemap.xml খুলে XML, homepage এবং কয়েকটি published story URL যাচাই করুন।
3. Preview সফল হলে আলাদা অনুমোদন নিয়ে production deploy করুন।
4. Production deploy-এর পর Google Search Console-এ https://imaginative-squirrel-3fbfd1.netlify.app/sitemap.xml জমা/পুনরায় পরীক্ষা করুন।

সীমাবদ্ধতা:
গল্পের page এখনো client-side rendering ব্যবহার করে। Dynamic sitemap গল্পের URL আবিষ্কারে সাহায্য করবে, কিন্তু Google indexing নিশ্চিত করে না। প্রতিটি story URL Search Console URL Inspection দিয়ে পরীক্ষা করতে হবে।
