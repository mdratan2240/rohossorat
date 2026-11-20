রহস্যরাত — Story SEO update

এই প্যাকেজে মূল SEO homepage ও admin.html অপরিবর্তিত রাখা হয়েছে।

নতুন সুবিধা:
- প্রকাশিত Firebase গল্পের কার্ড এখন crawlable /story/FIRESTORE_DOCUMENT_ID লিংক।
- প্রতিটি গল্প খুললে browser title, meta description, canonical URL, Open Graph এবং Article JSON-LD গল্প অনুযায়ী আপডেট হয়।
- পুরোনো ?story=ID লিংকও চালু থাকবে।
- Netlify _redirects /story/* ঠিকানাকে index.html-এ পাঠায়, ফলে আলাদা URL সরাসরি খুললেও সাইট কাজ করে।
- Admin panel ফাইল অপরিবর্তিত। Firebase collection/rules পরিবর্তন করা হয়নি।

প্রকাশের আগে গুরুত্বপূর্ণ:
এই সমাধান client-side rendering ব্যবহার করে। Googlebot সাধারণত JavaScript render করতে পারে, কিন্তু প্রতিটি গল্পের HTML server-side-এ আগে থেকে তৈরি নয়; তাই indexing নিশ্চিত নয়। Google Search Console URL Inspection-এ কয়েকটি /story/ID URL পরীক্ষা করুন।

Sitemap-এ ইচ্ছাকৃতভাবে শুধু homepage আছে, কারণ Firebase-এর প্রকাশিত document ID-র live তালিকা এই ZIP-এ নেই। Google homepage-এর গল্পের crawlable links থেকে story URL আবিষ্কার করতে পারে। গল্পের ID না জেনে sitemap-এ URL বানানো হয়নি।

প্রকাশ: ZIP extract করে এর ভেতরের ফাইলগুলো Netlify-র একই site-এ deploy করুন। আগের deploy মুছবেন না। আগে Deploy Preview থাকলে সেখানে পরীক্ষা করে তারপর Publish করুন।
