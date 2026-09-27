import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, RoundedBox } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowUpLeft, ChevronLeft, Download, Eye, FileText, Menu, MessageCircle, Moon, Package, Plus, Send, Sparkles, Sun, X, Rotate3D, Maximize2 } from 'lucide-react';
import Lenis from 'lenis';
import { brands, categories, products, audiences } from './data/catalog';
import './styles.css';

const TABS = ['الرئيسية', 'المنتجات', 'العلامات', 'الحلول', 'عن ريماس', 'تواصل'];

function Textile({ position=[0,0,0], scale=[1,1,1], color='#e8e2d7', rotate=0 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = rotate + Math.sin(state.clock.elapsedTime * .45) * .012;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * .55) * .014;
  });
  return <RoundedBox ref={ref} args={[3.2, .22, 2.15]} scale={scale} radius={.12} smoothness={6} position={position}>
    <meshStandardMaterial color={color} roughness={.82} metalness={0} />
  </RoundedBox>;
}

function HeroScene() {
  return <Canvas camera={{ position:[4.8,3.1,5.9], fov:36 }} dpr={[1,1.5]} gl={{ antialias:true }}>
    <ambientLight intensity={1.15}/>
    <directionalLight position={[4,6,3]} intensity={2.3}/>
    <directionalLight position={[-4,2,-3]} intensity={.75}/>
    <RoundedBox args={[3.65,1.05,2.3]} radius={.18} smoothness={5} position={[0,.55,0]}>
      <meshStandardMaterial color="#d2c9bb" roughness={.9}/>
    </RoundedBox>
    <RoundedBox args={[3.95,.26,2.55]} radius={.13} smoothness={5} position={[0,.04,0]}>
      <meshStandardMaterial color="#17191b" roughness={.84}/>
    </RoundedBox>
    <Textile position={[0,1.16,0]} color="#eee9df" scale={[1.02,1,1]}/>
    <Textile position={[-1.08,1.48,-.38]} color="#f5f1ea" scale={[.29,1.25,.42]} rotate={-.04}/>
    <Textile position={[1.08,1.48,-.38]} color="#f5f1ea" scale={[.29,1.25,.42]} rotate={.04}/>
    <Environment preset="apartment"/>
    <ContactShadows position={[0,-.12,0]} opacity={.34} scale={8} blur={2.7} far={5}/>
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={.38} minPolarAngle={1.15} maxPolarAngle={1.46}/>
  </Canvas>;
}

function LoadingScreen() {
  const [p,setP]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setP(v=>v>=100?100:v+4),35);return()=>clearInterval(id)},[]);
  return <AnimatePresence>{p<100&&<motion.div className="loading" initial={{opacity:1}} exit={{opacity:0}}><div className="loading-mark"><span>REMAS</span><i/><i/><i/></div><div className="loading-line"><i style={{width:`${p}%`}}/></div><small>{p}%</small></motion.div>}</AnimatePresence>;
}

function Header({active,setActive,onInquiry}) {
  const [open,setOpen]=useState(false);
  const go=(tab)=>{setActive(tab);setOpen(false)};
  return <header className="header">
    <button className="brand-lockup" onClick={()=>go('الرئيسية')}><strong>REMAS</strong><small>HOME COLLECTION</small></button>
    <nav>{TABS.map(t=><button key={t} className={active===t?'active':''} onClick={()=>go(t)}>{t}</button>)}</nav>
    <div className="header-actions"><button className="icon-btn" onClick={onInquiry}><MessageCircle size={17}/></button><button className="mobile-menu" onClick={()=>setOpen(v=>!v)}><Menu size={20}/></button></div>
    <AnimatePresence>{open&&<motion.div className="mobile-nav" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>{TABS.map(t=><button key={t} onClick={()=>go(t)}>{t}</button>)}<button onClick={onInquiry}>طلب شركة</button></motion.div>}</AnimatePresence>
  </header>;
}

function ProductCard({product,onOpen,index=0}) {
  return <motion.button className={`product-card card-${index%3}`} whileHover={{y:-7}} onClick={()=>onOpen(product)}>
    <div className="product-image"><img src={product.image} alt={product.title} loading="lazy"/><span className="image-index">0{index+1} ↗</span><span className="view-chip"><Eye size={14}/> عرض</span></div>
    <div className="product-copy"><div><small>{product.brand} · {product.category}</small><h3>{product.title}</h3></div><Plus size={18}/></div>
    <p>{product.description}</p>
  </motion.button>;
}

function ProductDetail({product,close,onInquiry}) {
  const [color,setColor]=useState('#e9e1d5');
  return <div className="detail-backdrop" onClick={close}><motion.div className="detail-panel" initial={{opacity:0,scale:.97,y:18}} animate={{opacity:1,scale:1,y:0}} onClick={e=>e.stopPropagation()}>
    <button className="modal-close" onClick={close}><X/></button>
    <div className="detail-media"><img src={product.image} alt={product.title}/><div className="detail-3d"><Canvas camera={{position:[3,2.1,4],fov:38}} dpr={[1,1.4]}><ambientLight intensity={1.2}/><directionalLight position={[4,5,3]} intensity={2}/><Textile position={[0,0,0]} color={color} scale={[1,.95,.82]}/><OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={1}/></Canvas></div><div className="viewer-badge"><Rotate3D size={14}/> 360° / 3D</div></div>
    <div className="detail-info"><span className="eyebrow">{product.brand} · {product.category}</span><h2>{product.title}</h2><p>{product.description}</p><div className="swatches"><span>لون العرض</span><div>{['#e9e1d5','#c7c0b5','#8b8b84','#34383a'].map(c=><button key={c} aria-label={c} style={{background:c}} className={color===c?'selected':''} onClick={()=>setColor(c)}/>)}</div></div><div className="detail-actions"><button className="primary" onClick={()=>onInquiry(product)}>اطلب عينة / أسعار الكمية <ArrowLeft size={16}/></button><button className="ghost"><Maximize2 size={16}/> عرض كامل</button></div><div className="detail-note"><span>مناسب للطلبات التجارية</span><span>REMAS HOME COLLECTION</span></div></div>
  </motion.div></div>;
}

function InquiryModal({product,close}) {
  const [kind,setKind]=useState('sample'); const [sent,setSent]=useState(false);
  const submit=e=>{e.preventDefault();localStorage.setItem('remas:lastInquiry',JSON.stringify({product:product?.title,kind,createdAt:new Date().toISOString()}));setSent(true)};
  return <div className="modal-backdrop" onClick={close}><motion.div className="modal" initial={{y:24,opacity:0}} animate={{y:0,opacity:1}} onClick={e=>e.stopPropagation()}>
    <button className="modal-close" onClick={close}><X/></button>{!sent?<><span className="eyebrow">BUSINESS INQUIRY</span><h2>{product?.title||'ابدأ محادثة تجارية'}</h2><p>للطلبات الخاصة بالشركات والفنادق والوكلاء وتجار الجملة.</p><div className="choice-grid"><button className={kind==='sample'?'selected':''} onClick={()=>setKind('sample')}><Package/> عينة مجانية للشركات</button><button className={kind==='pricing'?'selected':''} onClick={()=>setKind('pricing')}><FileText/> جدول أسعار الكميات</button></div><form onSubmit={submit}><input required placeholder="اسم الشركة"/><input required type="email" placeholder="البريد الإلكتروني"/><input placeholder="رقم الهاتف"/><textarea placeholder="تفاصيل الطلب" rows="4"/><button className="primary" type="submit"><Send size={17}/> إرسال طلب الاستفسار</button></form></>:<div className="success"><Sparkles size={36}/><h2>تم تجهيز طلبك</h2><p>في النسخة الإنتاجية يتم ربط هذا النموذج بقاعدة بيانات وفريق المبيعات.</p><button className="primary" onClick={close}>إغلاق</button></div>}
  </motion.div></div>;
}

function Home({setActive,openInquiry,openProduct}) {
  const [heroIndex,setHeroIndex]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setHeroIndex(v=>(v+1)%products.length),3600);return()=>clearInterval(id)},[]);
  const featured=products[heroIndex];
  return <main className="home">
    <section className="hero panel">
      <div className="hero-copy"><span className="eyebrow">SINCE 1995</span><h1>تفاصيل ناعمة.<br/><em>حياة أجمل.</em></h1><p>مفروشات تُشبه إحساس البيت — تجمع بين الجودة العالية والتصميم العصري.</p><div className="hero-actions"><button className="primary" onClick={()=>setActive('المنتجات')}>اكتشف المنتجات <ArrowLeft size={17}/></button><button className="ghost" onClick={openInquiry}>اطلب الكتالوج والأسعار <ArrowUpLeft size={17}/></button></div><div className="stats"><div><strong>30+</strong><span>عامًا من الخبرة</span></div><div><strong>4</strong><span>علامات تجارية</span></div></div></div>
      <div className="hero-visual"><div className="hero-3d"><Suspense fallback={null}><HeroScene/></Suspense></div><div className="hero-overlay"><span>THE ART OF EVERYDAY COMFORT</span><b>REMAS HOME COLLECTION</b></div><motion.button className="hero-product" key={featured.id} initial={{opacity:0,x:15}} animate={{opacity:1,x:0}} onClick={()=>openProduct(featured)}><img src={featured.image} alt={featured.title}/><div><small>{featured.brand}</small><strong>{featured.title}</strong></div><ArrowLeft size={16}/></motion.button></div>
    </section>
    <section className="intro-strip"><span>جمال في كل خيط.</span><span>عناية في كل تفصيلة.</span><span>حلول مصممة للشراكة.</span></section>
    <section className="auto-products panel"><div className="section-heading"><div><span className="eyebrow">01 — COLLECTIONS</span><h2>منتجات تظهر تلقائيًا.<br/><em>بدون ضوضاء.</em></h2></div><button className="text-link" onClick={()=>setActive('المنتجات')}>كل المنتجات <ArrowLeft size={16}/></button></div><div className="auto-grid">{products.slice(0,4).map((p,i)=><motion.div key={p.id} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{delay:i*.08}}><ProductCard product={p} index={i} onOpen={openProduct}/></motion.div>)}</div></section>
    <section className="brand-ribbon panel"><div><span className="eyebrow">OUR BRANDS</span><h2>أربع علامات.<br/><em>عائلة واحدة.</em></h2></div><div className="brand-mini-row">{brands.map(b=><button key={b.name} onClick={()=>setActive('العلامات')}><img src={b.image} alt={b.name}/><span>{b.name}</span></button>)}</div></section>
  </main>;
}

function Products({openProduct}) {
  const [cat,setCat]=useState('الكل'); const [brand,setBrand]=useState('الكل'); const [aud,setAud]=useState('الكل');
  const list=useMemo(()=>products.filter(p=>(cat==='الكل'||p.category===cat)&&(brand==='الكل'||p.brand===brand)),[cat,brand]);
  return <main className="page"><div className="page-title"><span className="eyebrow">02 — PRODUCTS</span><h1>كل قطعة، لها<br/><em>مساحتها.</em></h1><p>تصفح المجموعات الأصلية، ثم افتح أي منتج لمعاينة 3D وطلب عينة أو أسعار الكميات.</p></div><div className="filters"><div className="filter-row">{categories.map(x=><button key={x} className={cat===x?'active':''} onClick={()=>setCat(x)}>{x}</button>)}</div><div className="select-row"><select value={brand} onChange={e=>setBrand(e.target.value)}><option>الكل</option>{brands.map(b=><option key={b.name}>{b.name}</option>)}</select><select value={aud} onChange={e=>setAud(e.target.value)}>{audiences.map(a=><option key={a}>{a}</option>)}</select><span>{list.length} منتجات</span></div></div><div className="products-grid">{list.map((p,i)=><ProductCard key={p.id} product={p} index={i} onOpen={openProduct}/>)}</div></main>;
}

function Brands(){return <main className="page"><div className="page-title compact"><span className="eyebrow">03 — BRANDS</span><h1>أربع علامات.<br/><em>عائلة واحدة.</em></h1><p>أربع هويات تحت مظلة واحدة، لتغطية احتياجات المفروشات اليومية والمشاريع والشركاء.</p></div><div className="brands-grid">{brands.map((b,i)=><motion.article key={b.name} className="brand-card" whileHover={{y:-5}}><div className="brand-number">0{i+1}</div><div className="brand-art"><img src={b.image} alt={b.name}/></div><h3>{b.name}</h3><p>{b.note}</p><button className="brand-link">اكتشف العلامة <ArrowLeft size={15}/></button></motion.article>)}</div></main>}

function Solutions({openInquiry}){return <main className="page solutions"><div className="page-title"><span className="eyebrow">04 — SOLUTIONS</span><h1>للمساحات، إلى<br/><em>تفاصيل أوسع.</em></h1><p>حلول توريد مرنة للمشاريع والشركاء، مع إمكانية تخصيص التشكيلة حسب الاحتياج.</p></div><div className="solution-grid"><article><span>01</span><h3>للفنادق</h3><p>تشكيلات مناسبة للغرف والمشاريع مع مواصفات قابلة للتخصيص.</p></article><article><span>02</span><h3>للوكلاء والموردين</h3><p>منتجات عالية الجودة تلبي احتياجات السوق وتدعم التوريد المستمر.</p></article><article><span>03</span><h3>لتجار الجملة</h3><p>تشكيلة متعددة العلامات والفئات لتغطية احتياجات نقاط البيع.</p></article><article><span>04</span><h3>حلول لكل سوق</h3><p>خدمات لوجستية وتخصيص في المنتجات والتشكيلات حسب احتياج السوق.</p></article></div><div className="b2b-banner"><div><span className="eyebrow">COLLECTION SERVICES</span><h2>جهّز اختيارك<br/><em>في خطوة واحدة.</em></h2></div><button className="primary" onClick={openInquiry}>ابدأ طلبك <ArrowLeft size={17}/></button></div></main>}

function About(){return <main className="page about"><div className="about-hero"><span className="eyebrow">05 — OUR STORY</span><h1>منذ ١٩٩٥.<br/><em>والبيت في قلب الحكاية.</em></h1><p>تأسست شركة REMAS عام 1995، ومنذ ذلك الحين تعمل على تقديم مفروشات تجمع الجودة العالية والتصميمات العصرية.</p></div><div className="principles"><article><b>01</b><h3>الجودة والراحة</h3><p>منتجات تجمع الجودة والراحة والمتانة للاستخدام طويل الأمد.</p></article><article><b>02</b><h3>التصميم العملي والجمالي</h3><p>تصميمات تجمع الأناقة والوظيفية لتناسب الأذواق والاحتياجات.</p></article><article><b>03</b><h3>خدمة العملاء</h3><p>دعم متكامل قبل وبعد الشراء وتجربة شراكة أكثر سلاسة.</p></article></div><div className="manifesto">COMFORT,<br/><em>WOVEN INTO</em><br/>EVERY DETAIL.</div></main>}

function Contact({openInquiry}){return <main className="page contact"><span className="eyebrow">06 — CONTACT</span><h1>شراكتك القادمة،<br/><em>تبدأ بمحادثة.</em></h1><p>لمساحتك ولمشروعك القادم. تواصل معنا للتفاصيل والاختيارات المناسبة.</p><div className="contact-actions"><button className="primary" onClick={openInquiry}><MessageCircle/> تواصل مع فريقنا</button><a className="ghost" href="mailto:Remashome798@gmail.com">Remashome798@gmail.com</a></div><div className="contact-note"><span>REMAS · OXFORD · ROJA · DENZLI</span></div></main>}

function App(){
  const [active,setActive]=useState('الرئيسية'); const [modal,setModal]=useState(null); const [detail,setDetail]=useState(null); const [dark,setDark]=useState(()=>{const saved=localStorage.getItem('remas-theme'); return saved ? saved==='dark' : true;});
  useEffect(()=>{localStorage.setItem('remas-theme',dark?'dark':'light')},[dark]);
  useEffect(()=>{const lenis=new Lenis({duration:1.05,smoothWheel:true});let raf;const loop=t=>{lenis.raf(t);raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);return()=>{cancelAnimationFrame(raf);lenis.destroy()};},[]);
  const openInquiry=product=>setModal(product||{title:'طلب تجاري'}); const openProduct=product=>setDetail(product);
  const view=active==='الرئيسية'?<Home setActive={setActive} openInquiry={openInquiry} openProduct={openProduct}/>:active==='المنتجات'?<Products openProduct={openProduct}/>:active==='العلامات'?<Brands/>:active==='الحلول'?<Solutions openInquiry={openInquiry}/>:active==='عن ريماس'?<About/>:<Contact openInquiry={openInquiry}/>;
  return <div className={dark?'app dark':'app'}><LoadingScreen/><Header active={active} setActive={setActive} onInquiry={()=>openInquiry()}/><AnimatePresence mode="wait"><motion.div key={active} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.35}}>{view}</motion.div></AnimatePresence><button className="theme-toggle" onClick={()=>setDark(v=>!v)} aria-label={dark?'تفعيل الوضع الفاتح':'تفعيل الوضع المظلم'} title={dark?'الوضع الفاتح':'الوضع المظلم'}>{dark?<Sun/>:<Moon/>}</button>{detail&&<ProductDetail product={detail} close={()=>setDetail(null)} onInquiry={p=>{setDetail(null);setModal(p)}}/>}{modal&&<InquiryModal product={modal} close={()=>setModal(null)}/>}<footer><span>© 2026 REMAS HOME COLLECTION</span><span>COMFORT, WOVEN INTO EVERY DETAIL.</span></footer></div>;
}

createRoot(document.getElementById('root')).render(<App/>);
