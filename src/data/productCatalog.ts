// AUTO - ära muuda käsitsi, genereeritakse XLS-ist
import cpu from './products/lauarvuti-osad-kasut/protsessor-pc.json';
import combo from './products/lauarvuti-osad-kasut/combo.json';
import emaplaat from './products/lauarvuti-osad-kasut/emaplaat.json';
import ram from './products/lauarvuti-osad-kasut/m-lu-dimm.json';
import monitorid from './products/monitorid/monitorid-22-25.json';
import laserprinter from './products/printerid-toonerid/laserprinter.json';
import toonerLaser from './products/printerid-toonerid/tooner-laserprindile.json';
import toonerid from './products/printerid-toonerid/toonerid-tindid.json';
import used3 from './products/desktop-kasutatud/used-3-gen.json';
import used2 from './products/desktop-kasutatud/used-2-gen.json';
import used4 from './products/desktop-kasutatud/used-4-gen.json';
import used7 from './products/desktop-kasutatud/used-7-gen.json';
import used6 from './products/desktop-kasutatud/used-6-gen.json';
import laptop14 from './products/laptops/laptop-14.json';
import laptop14a from './products/laptops-used/laptop-14.json';
import laptop1213 from './products/laptops-used/laptop-12-13-used.json';
import laptop15 from './products/laptops-used/laptop-15-used.json';
import laptop14used from './products/laptops-used/laptop-14-used.json';
import { autoProducts } from './productCatalog/autoProducts';

const catalogProducts = [
  ...cpu, ...combo, ...emaplaat, ...ram,
  ...monitorid,
  ...laserprinter, ...toonerLaser, ...toonerid,
  ...used3, ...used2, ...used4, ...used7, ...used6,
  ...laptop14, ...laptop14a, ...laptop1213, ...laptop15, ...laptop14used,
  ...autoProducts,
] as any[];

const productsBySku = new Map<string, any>();
catalogProducts.forEach((product, index) => {
  const identity = product.sku || product.specs?.SKU || product.id || `product-${index}`;
  productsBySku.set(String(identity), product);
});

export const allProducts = Array.from(productsBySku.values());