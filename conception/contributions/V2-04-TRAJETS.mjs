// Validation d'un sous-probleme depuis t4, pas solveur du poste complet.
import assert from 'node:assert/strict';
const links = ['OT','TG','GA','AP','TD','DE','EF','FP','PQ','TH','HC'];
const edge = (a,b) => links.includes(a+b) || links.includes(b+a);
const closedBridge = new Set([5,6,9,10,13,14]);
const cases = [
  {name:'ouverte-observation-precoce',open:true,observer:'C',r:['G','A','P','Q','P','Q','Q','Q','P','Q'], expected:[7,8,1200]},
  {name:'bloquee-detour-precoce',open:false,observer:'C',r:['D','E','F','P','Q','P','Q','Q','P','Q'],expected:[8,9,1100]},
  {name:'bloquee-attente-observation',open:false,observer:'H',r:['T','D','E','F','P','Q','Q','Q','P','Q'],expected:[9,10,1000]},
  {name:'bloquee-engagement-puis-observation',open:false,observer:'H',r:['G','T','D','E','F','P','Q','Q','P','Q'],expected:[10,11,1000]},
  {name:'bloquee-decouverte-par-refus',open:false,observer:'H',noObserver:true,r:['G','A','T','D','E','F','P','Q','P','Q'],expected:[11,12,800]},
];
const results=[];
for(const c of cases){
 let positions=['T',c.observer], cargo=['battery','q2'], receipts={}, trace=[];
 let q3Picked=false,q4Picked=false;
 for(let t=5;t<=16;t++){
   const desired=[c.r[t-5]??positions[0],t===5&&!c.noObserver?'C':positions[1]];
   const next=desired.map((dest,i)=>{
     const from=positions[i];
     assert(from===dest||edge(from,dest), `${c.name}: edge ${from}-${dest} at ${t}`);
     if(!c.open&&((from==='G'&&dest==='A')||(from==='A'&&dest==='G'))) return from;
     if(closedBridge.has(t)&&((from==='A'&&dest==='P')||(from==='P'&&dest==='A'))) return from;
     return dest;
   });
   assert(next[0]!==next[1],`${c.name}: occupation collision at ${t}`);
   assert(!(next[0]===positions[1]&&next[1]===positions[0]),`${c.name}: edge swap at ${t}`);
   positions=next;
   if(positions[0]==='P'){
     if(cargo.includes('battery')){receipts.battery=t;cargo=cargo.filter(x=>x!=='battery');}
     if(t>=9&&!q3Picked){cargo.push('q3');q3Picked=true;}
     if(t>=13&&!q4Picked){cargo.push('q4');q4Picked=true;}
   }
   assert(cargo.length<=2,`${c.name}: cargo capacity at ${t}`);
   if(positions[0]==='Q'){
     for(const x of cargo.filter(x=>x.startsWith('q'))) receipts[x]=t;
     cargo=cargo.filter(x=>!x.startsWith('q'));
   }
   trace.push({t,r:positions[0],observer:positions[1],cargo:[...cargo]});
 }
 // Phase 1: 300 points importes d'un prefixe NON valide ici.
 const needs={p1:true,f1:true,q1:true,p2:receipts.battery>4&&receipts.battery<=8,
 f2:true,q2:receipts.q2>4&&receipts.q2<=8,
 p3:receipts.battery<=10,f3:true,q3:receipts.q3>8&&receipts.q3<=12,
 p4:receipts.battery<=10,f4:true,q4:receipts.q4>12&&receipts.q4<=16};
 const points=100*Object.values(needs).filter(Boolean).length;
 assert.deepEqual([receipts.battery,receipts.q2,points],c.expected);
 results.push({case:c.name,receipts,points,stockLost:receipts.battery>8,pumpLost:receipts.battery>10,trace});
}
// L'indiscernabilite des variantes sans observateur est un contrat de rendu
// a tester dans le futur jeu ; ce script de trajets ne peut pas la certifier.
const output=process.argv.includes('--trace')?results:results.map(({trace,...summary})=>summary);
console.log(JSON.stringify({scope:'temoins t4-t16, prefixe 300 points suppose, pas optimalite globale',results:output},null,2));
