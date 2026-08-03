import { useState, useEffect, useRef, useCallback } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ══════════════════════════════════════════════════════
   SERIAL KEY SYSTEM
══════════════════════════════════════════════════════ */
// SHA-256 via Web Crypto API
async function sha256(str){
  const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

// Device fingerprint — stable hash of browser/hardware signals
async function getDeviceId(){
  const nav=window.navigator;
  const raw=[
    nav.userAgent,nav.language,nav.hardwareConcurrency,
    nav.deviceMemory||"",screen.width,screen.height,screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ].join("|");
  return sha256(raw);
}

// Key hash map — keys stored as SHA-256 hashes only
const KEY_MAP={"ac7b116caecc665df483dea3ddacbda2cb5c5f3b86a7571d6d2d6cac66699642":{"type":"demo","days":3},"cddf45a46b5690644e1712a811769324e7e0a00d4a72bb0792f449929938b024":{"type":"demo","days":3},"4950e0c13a2e16c7377eb18f0de0cc09a325dc1e48da58a1ea7e4f8a29c114a0":{"type":"demo","days":3},"6c645faf8be9f0d52bc32cb11490057224630bfefe6461210bd87d1385182904":{"type":"demo","days":3},"aa01a44222f3ea97ccde1dc63b70d21ad22dda9e3ff172e49ebd7d4e8cb1b837":{"type":"demo","days":3},"9f6271fe301d1ac380c5a4ec94350c3b5e1e9b8181615915c30e13e05eb3580d":{"type":"demo","days":3},"d733724d379c516fc3d74b57c98d13e73029c49c7510fe3304148d6a2a99bc3c":{"type":"demo","days":3},"4e81e5ec510881ae34985eb1a023bea38da6866353110227316f28c4c74e1344":{"type":"demo","days":3},"bcfb2e667ccb8cb7f74c8a84aae425288c8ebb4b6e80c61a9183fd9e7207119e":{"type":"demo","days":3},"78e5da7a8b18a06e724d712cb60614766526bfcc195f1678b04028e45637c4e7":{"type":"demo","days":3},"76f854712650b14d866a6cea7e1cd3e141512ea4f7cdb2fe449836eadba943cf":{"type":"demo","days":3},"a00eee68fe692700117c2036612b499f3a58f04877dc3341356756725e5d4ac0":{"type":"demo","days":3},"192ab2fc94aef5960ede8abd42012102d2f10e885d6d97d3bb214d6b87d3c706":{"type":"demo","days":3},"575a45ebd3a45ca67448ea916cb3ec3836bbf44db3f6fa38340c6d789ec95e55":{"type":"demo","days":3},"7663e050811cc633937b0ddbd6c0ce866c7c97a73bca642e9839092e76244469":{"type":"demo","days":3},"9ea47700cd6ddd4989ea4e9274c8f80f33b1e1776421ed15141790d4cac83af3":{"type":"demo","days":3},"d252febf7e3b33e46e5d5f2ee926b89038025660fd9e3e03ae4d54e7b1387a62":{"type":"demo","days":3},"47665be168380911d695a0a17438f0b9b6eddb778e2b723e64e10b43d7cfe581":{"type":"demo","days":3},"be80751864bc92b4e9a21acbcc88847ae1e0dd00f4e88f5ffdaee2a29910c21c":{"type":"demo","days":3},"fb54d5e3fa7eb13543dad93d7fd5ff3095149288cdd389058d06405c59639770":{"type":"demo","days":3},"a0b648ca22c66dae6b65a32dcc01ef1ca605f9f7fa3f4b7c719b6d93d845ba81":{"type":"demo","days":3},"8ce71574fbfa3c1fd7cc69fb877f5c3bd9119bdaf6b06c35cb9a1c4a5eab27b5":{"type":"demo","days":3},"f8d3c4864410d10395ccc4bbcfd3bce2575c96157096172b949f3153f521894a":{"type":"demo","days":3},"3e87c9554f375f657dc3de6621f227529d15f4bb7cb7e36d682166407a387480":{"type":"demo","days":3},"37fdf6ad52d32855abc6eb7c00d28af5a5036e4e11385a8c3baf6c37e64c54b6":{"type":"demo","days":3},"8b02092e938ce5e370330f6a6da560e5441ec559c313ece9ac214d9e3583eb23":{"type":"demo","days":3},"2c68b71d7e463d58dc7b7c5dbb3e25d462cccdf68e994b574831a140f0dc1895":{"type":"demo","days":3},"febe5bde98c9738cb17cefdc70c9aac4034dcc19fe559b3bc34f21a47a1140c1":{"type":"demo","days":3},"58e5fd71ce8335a0649deccdb9eb429bd7a8d702b41accf4a8274207e58dd821":{"type":"demo","days":3},"15e6d13b4502a91472aae6d34075a027d2f26051d9ee33175290c9c6e28c28ac":{"type":"demo","days":3},"7f27bb897645e47f864c32cdb324fd6c27793056c9bee0361ba521bfe2ea04c5":{"type":"demo","days":3},"b312a2372419c72cc7ff1e1f102675d3998157d070ac821ee472d53920c11126":{"type":"demo","days":3},"8e35a2df951c3453495d9be20437ca80f1178a631bdfefb0385794b4a0ccb6cc":{"type":"demo","days":3},"d803884ffac608914669ae7bda1c288e9ac3c3a5aa03c27b3a3a986ac5bb06bb":{"type":"demo","days":3},"d4c47bafb0c5b0e2dda6e0aca2bf05683866e4b10fd6b8d53b4006e3e6609e18":{"type":"demo","days":3},"fac1d2630ab443c170295f9578f32a040c0e57aaf72dc315c25bb29b99076ff1":{"type":"demo","days":3},"b4b899941a0fc17462a7421f604e5d7b858b2730a389513358b5dbb18bde4060":{"type":"demo","days":3},"363175f0a198e911ed3d5087744b18e8cc82f0e9a0afa59b9ba2a1dfcf70379a":{"type":"demo","days":3},"42ac85aed8eeda1289bc58a695f2e3c13c77ea64360dc40e4afc1830fe452bb9":{"type":"demo","days":3},"969cd04b46d0090a8d56b61a9f1d4515838189f2c0fa0c9a269ad4092f1f7bbf":{"type":"demo","days":3},"0adc9796b04a7738c7296ad3302620920d83aa7831f708d0c1d6ee95708fbc9a":{"type":"demo","days":3},"aa997f2e33d4f9b573f6b92f9e516138ea6eeb1c7c57b495f055e4f8f731d280":{"type":"demo","days":3},"3035078a5934ae96792bac7302fc4845a9998b2782a7cbfe986912432e5e82e2":{"type":"demo","days":3},"2ad4f2d53872c5f7ca90ae89e8333291a4973815eb4fdef454062bbc9e00c33a":{"type":"demo","days":3},"22b3211166a790dad3d82a73c6bc8dd47daffe7e691cc49a4f4936b26574f85d":{"type":"demo","days":3},"490d0cddb82d3d1a25c5478df53748e0f7b1818ea9f9de284a3df30b7d0fc3fc":{"type":"demo","days":3},"a56c2bfa233820421ddf748921fb7e22cfd3bffb6dc341248e028a86cd406f4e":{"type":"demo","days":3},"2bd43dd09b529cee517bd8dfc1ff69f0e044dc0c77a2bcb7e7e5cf55b3d77f8a":{"type":"demo","days":3},"f45be2ad34677dab85b46922947dac867c4b74a7226186a6992cf436508f99a5":{"type":"demo","days":3},"bafddd2ce0405ce79fd42b1c73495324a44d206dd6d9321770bd6224ec3ee799":{"type":"demo","days":3},"a5364182395c833243c4992afe8c66251aa4506d0162d60e891123e5523a42cd":{"type":"demo","days":3},"6ec9b6444c6ab2022a4b1df3877801dc4c69dc79682d136168968b0f9bdbf643":{"type":"demo","days":3},"953665cd7cb43396f5f749dcb547a0c6f17a52a9b9cd8997624e4b2ec83d5ea4":{"type":"demo","days":3},"165d4fef084801371ee811ea360f9bc4ab41d0d0f89ab2d935faf4666850cf4b":{"type":"demo","days":3},"69868f6c3302005c8c3398fe1d146b9b105f73a8f06afb5e395b1e66aac8e50f":{"type":"demo","days":3},"92a8e42fd2db733f18a9417371caecf99f02ca7211b7b6d18f4c3f14e3fb35a0":{"type":"demo","days":3},"65718f82b88e6f75f88a2e96d7033dab7440ecc969c5ba9fe9d1c044303924cd":{"type":"demo","days":3},"241e8cc4456b5caba036da989dd44507268ce6ac270ef7f37d2e27efc02841b1":{"type":"demo","days":3},"02a774fd4bc9d3e067040133bd57f014a1f91541b36d5f27b4599353acccf53e":{"type":"demo","days":3},"fe09391f27b5feef58f16e42f6af369cc2fb1c571f032b78b11c13f2e2f5c79f":{"type":"demo","days":3},"48a337e30882c145d84e01586be376aae6d229c3ec0c9b199dcf6e552db07470":{"type":"demo","days":3},"b2a7343c662ae0ea4002685419d939aa5e7b4ddd2cc642085ce1495ff15f8ea3":{"type":"demo","days":3},"d360e3b6e52da3223d6dfcdc49100af55118a601391dc52ca1b402632f12faec":{"type":"demo","days":3},"2608fa0a3a3af7dd1d252a9459646b40bdd06c53a996d67ecb5ef6e29cfe1f60":{"type":"demo","days":3},"cbdb864301385ce7e666b196d22d77d0d190048a254a5eff46db211e385e58fe":{"type":"demo","days":3},"8435841d57e4e8491cb5170b48c3cdf1349f9cf0d0e6384dc8b91087ec81d88c":{"type":"demo","days":3},"bc45257950a8719678b2b7ddb421fe917aabe18d4b3b7112a5338006bd23f445":{"type":"demo","days":3},"63c3f8c317b88e21d3b58e66b42b0c88c0181bfd490df6315473fd8009ace5db":{"type":"demo","days":3},"21e2e51bdb57e2b8c84dcdf78a279e45bad934579a5cdac6f3a8d61e1a085123":{"type":"demo","days":3},"2349adba9fa2a34c07e756f5e102aeb334dd4a2d1649708e30ba6ef2abadbf29":{"type":"demo","days":3},"f00544ae2f8910c4d7f8e472f9c5c0afcd5ae8fb02e31c6b1c3d470df4b6e00e":{"type":"demo","days":3},"ff609fce811be6a425b73a9d04157d081c63d71b3b0cc926cbdd6fd7d30477f2":{"type":"demo","days":3},"e4ea36e386cf6890272a8094c4a2ef11e2d322d760980f726757607ad9f13e4f":{"type":"demo","days":3},"6822d91510d71f1625e4e8667e44da8ae26fc5111b431203acd8f39569d4765c":{"type":"demo","days":3},"ce6bdb1686525af588e82d29b48ac815fcc6f14659f57026445d68f9ac953f17":{"type":"demo","days":3},"604d99c28c97166d6d2ddf4440d13b05e5acce4f30026fa49209d1d2c31673a5":{"type":"demo","days":3},"a92376e5b65d4802e6c22d926f12d042f1f3645d5e7b776bcc6c3370ee6596bf":{"type":"demo","days":3},"4dea721afc7e3fa9b1ea8beae02625c86096b5df9d44e5627d95346a2b2a7329":{"type":"demo","days":3},"6f06abab22cf1389abb795d30bbb95a144d482937b19a8554eb19104a559f03a":{"type":"demo","days":3},"c85cdcf081b44cd07378ae59796b67b654eb54aa918e887432e57a50cc42a53b":{"type":"demo","days":3},"5175cf21c1c5da7413203d46b8d5683bc860f4f4ea506f57aa8bce1d1e25abd3":{"type":"demo","days":3},"be9fe337557ac084fcd327876a726fc480632aa473bba418520f45d3560e0746":{"type":"demo","days":3},"efd96d18001dd07b624be8eff9a961ac5ad32f34ddc94311c7e31f21dcd8529e":{"type":"demo","days":3},"dc430c9bc1b29ba8d155da0da4f5f8c7409797a869f288f07891e725cbabda2a":{"type":"demo","days":3},"a021efc3f697f2186bd39404456feb311e36553196320efd195e0915f9e604d7":{"type":"demo","days":3},"dd3ced442c2badcff0abddea61b7f5e7c6d25bc9bba39d8985242ad046a149ab":{"type":"demo","days":3},"45d7b905d3608a014ad7127e3c3b11a62f74ede90a8c39cf2d9d6f6662b158bb":{"type":"demo","days":3},"1954ed61de63f98bd975272908d0784f81c1ace182baf863e2162a2f935e3c27":{"type":"demo","days":3},"9e39df6385b6594507efffabaf9bdba6706a5b83e83deaee566d9e74121086d5":{"type":"demo","days":3},"15246070efcc1f826943e0d3b6ded5724d27753c5827e11ddd077f87af57c6c7":{"type":"demo","days":3},"8f9f1ab31ca44fd8c08a14b5e7238cb60591edf0abc1e6f6120c5bcf386b6d43":{"type":"demo","days":3},"a5c6377e534b9b928224c11f24b678d22f72dfa88decca670bd54532a52e7eb2":{"type":"demo","days":3},"db4e36c3af2e1989dd9e5992e6a0ce9bbd27e7aa7afbd3fd1660815ef26721b4":{"type":"demo","days":3},"c6c5a3222f07bd71982fb9a2eba7a1237f3418d0efe042ce05336629415e8eff":{"type":"demo","days":3},"bb1c87d0623f524f89ac82df80cc1ea3e95a1a34bc7e2dc36ff560155ecb7558":{"type":"demo","days":3},"608cb80c6c0cd92ed724b6229d8488e36d0793fec2fed582780273e30d72abad":{"type":"demo","days":3},"6e01149bc97972e1b927746673e5520e2103aac859681725101394f755f2a6ff":{"type":"demo","days":3},"8dad771fde02bc24c826d44ac7eff1681862d3b7ee9ae410511b6714aff89a22":{"type":"demo","days":3},"9188cb3ada0a50c1ce33b4d8bfd522e79414d67b576c63ed7f669301f943db44":{"type":"demo","days":3},"2a56835a20ba34fc732173d3205b7fb8c60ce2863b99379851e1e29abfaa3412":{"type":"demo","days":3},"fe952c78be2dd7195aae58ff35d8d76380ae876a9847979e408b6f42ee04f338":{"type":"demo","days":3},"bc9c50c88c9e7caf95e6dc428de0391e0223f9cf6f7787573dbea7f9fd6d0fd9":{"type":"demo","days":3},"0ede459f0d895cd8905d42aaeb9143aa90cdfeecb40cc44a2197cb6a578bbbbe":{"type":"demo","days":3},"640ddef8e137162a589b3143b0c4e853bd60446b74fc94cc68d5a0398ab781e1":{"type":"demo","days":3},"af222120dd627e7561e9f00acc73cfac4e9e9442597bfa7a5f0ca8280e01a93c":{"type":"demo","days":3},"50b9355e72987f2814fa82cd49b20aef2a846b180a9126c180a1378034b38178":{"type":"demo","days":3},"e5d434ce4529703dd6d3b9e4ba4b61860de72a9c00287f1603b6624e13207993":{"type":"demo","days":3},"01bad9cf75097cc8aa703584faaa044e64d0c1af400b658f406fa67619b610e4":{"type":"demo","days":3},"2c790ebe919839848586437d5a0401e8cbf17696d5662f84b2be376a30c6e524":{"type":"demo","days":3},"b78f6b1b673bcec64b147119cb9055b04a417362bce7541bdc2e13a24da6b51d":{"type":"demo","days":3},"5c9c36ed0eca5811ebbc6ac68cb50347fc7e7de5a98364913083419e3baf8e75":{"type":"demo","days":3},"135d6966b0b5bb0d5f115188c70edce00db9ecf0fdf3d3dd509f821cf6bdfcac":{"type":"demo","days":3},"73f86c8cec5d5d82df3f24f3b73dc3b0b80783fdee2242e7bade9adfbb98121a":{"type":"demo","days":3},"8d83c74cb44d56d0d3871fda78c3d81d013673a39982f1a5b11d7acfcd0f3f62":{"type":"demo","days":3},"7ab0c388d4970808c5fa63e6d2f6a5c1cb7d7a76bd651aa22b8375912d5a9644":{"type":"demo","days":3},"851f941df3c7f3102ac53d56be44bff0d4285e30db128b5e3e6166355b707f38":{"type":"demo","days":3},"89f3d2b670612f39acfe06e05dc65d3e754b4c27ccc3364f20ab7ca716672bb2":{"type":"demo","days":3},"2bd3deda36daed7a620b0df5febdb0d58b0dc5af6348be144bdb72924810ad27":{"type":"demo","days":3},"8468646fd67a3fb0381544e54aca0feac52a12ca0d7c3424e62c8d80a44653e1":{"type":"demo","days":3},"4f2a8920c4aae62e7e0d22f35263c182d522df0e4a2fa3f69dfaadaf79048eaa":{"type":"demo","days":3},"1dea1eb3744f62d7a490f466c5a1cdb458d3fe52ab4cec9c9da66505ed722866":{"type":"demo","days":3},"b0205a5299579078022b9879b19758a2f43509272641efba1bd00d426b28fff2":{"type":"demo","days":3},"72a3e5312c21e220302c6487d57d37879ab92f1986d7a977d93d2cb63b664b3d":{"type":"demo","days":3},"93cf198ce66075763a13b61ed490adfa6ecbd6c11d26fc0e766f2b000c45e441":{"type":"demo","days":3},"978ba79936dc07cda8291f2f249046533a2e35308a116e3e57f9262eb3aa9734":{"type":"demo","days":3},"09fbf8b0bc1bb068e22cd03db90e70a3c1efcc41103812a8d45a66b0ddda9f94":{"type":"demo","days":3},"8b492d70f47d1f5de11ad5ed961e29c3d5452e434e4d26f1b2c3232e2543d53c":{"type":"demo","days":3},"dd3da4685734dd9cb605e4f58dde2c760cafd43442997a21ac86584681047d8f":{"type":"demo","days":3},"edc2a62e5217096430f7f9a9000a78c6ddd09a558015e0c3f1dfa3171c2a2e80":{"type":"demo","days":3},"11c04df06ca9ab7cc0407b3bde018aed6545bb7bdbf3feb4c2dcf77ef13a2142":{"type":"demo","days":3},"106dc4cf72216cf0511c605262f007523818328ebb2db079a20431f7947065d2":{"type":"demo","days":3},"b06964f0983f747f44fafc49f20e4e5905989de32db0a2a29cc3d51af0b00719":{"type":"demo","days":3},"d9dd5888ca260679dea462804100e4c725bd17e2709b90f94bfedea4df21e480":{"type":"demo","days":3},"08562e87ce93b4b5c1e83cf1b7623763aef75d8e0e5906fd85fa5128a8f433bb":{"type":"demo","days":3},"dd2acc6f5c42b0662c9c0d04fc68fdbb2bdc839fe62d12f15d3a75c39642e923":{"type":"demo","days":3},"0dc6816a729dfb90366b9feff73ad3170dbe509e4f002164edfd5b75293d08f9":{"type":"demo","days":3},"3d45cc1daa95f1beba9ef30f24ea794125ad8d9bfd52aa9aaf7d4c93ddd3d3e5":{"type":"demo","days":3},"821e9afb10252a9e9adae4a659162d2bad308aabd8a75ed2c1222286d7d500b1":{"type":"demo","days":3},"f215ad49d66e1e9c3cb12a9d0c521710b1808412050a5f92502468518aaa3799":{"type":"demo","days":3},"439b7dd46b4b7004fd499d367e8e7d0780c3b4e7b40cf36e4716afbc299d6e05":{"type":"demo","days":3},"15a49bd47555edb4715b59aacb8babc1d9a1d75fc779e168257f02aa22a76e6a":{"type":"demo","days":3},"35083e95532770121e8eddb9d8924ac4d507de7abcf092b16ba1ce2dcb458051":{"type":"demo","days":3},"24aa18bb07cadf3a103490fc328b96cafd5e896aae3d7d451efc9d42aba0177c":{"type":"demo","days":3},"f51fc7eb0a1a878d9121415934043aa8b28be0d03076b771a782a1c37cec8652":{"type":"demo","days":3},"b88ac05447466d3189ded764a21dc595dc8bb5cbfa800b104d6490b88169d180":{"type":"demo","days":3},"61c4979b258ade8c7f8229ebf4697eeee65cc8fee75e459f294ec56b3c79b80f":{"type":"demo","days":3},"540d7b344e1b7f92dd92fa7890c0237adba62bc319e296087490c0f4b6374544":{"type":"demo","days":3},"cd26558e19f2ba8242c8bc8db16a05dd9ac42c780623135d37f483e58474458a":{"type":"demo","days":3},"c109a6062b25b4daef2fb666c71403bb23fea62a35d150ff298db83375a7b8a2":{"type":"demo","days":3},"07ca140e188add2cf05904d2492c0ea2af6e6326179c8fe2065930e405f4e30b":{"type":"demo","days":3},"3b062fee0a843b0140617c912668470421c5d0b712291082ef0e7329e7e88513":{"type":"demo","days":3},"1c7e50e3fb148702fabd5aeb905625d34a790f6f1c106d83f5d08cfce81bd5ce":{"type":"demo","days":3},"7df6bcf61f981e69a566b66b7bbf6190ebaf9096fe44e84bd9f2560fe499bb7e":{"type":"demo","days":3},"8ac403ac8e99aaab2d57274a3e9d28fbd27947d5ed913fde15f047d0a4b6242b":{"type":"demo","days":3},"94a3998ed5941bcc8515b3ca74d2a4bf8812fe40225de5975000ceceebc2624a":{"type":"demo","days":3},"cd2ed38a3d9d7705136d4ad277769c87c19ac7139dcd3cc89bacd1b7f0161d71":{"type":"demo","days":3},"29f746875d79cc21cd51081fec7d34b0e6a491e687b63a7dd0506d1f1948eb50":{"type":"demo","days":3},"9dd5163e7c18abb08696fe930b8b0433bc882e1436310edafb3b293c88763f1f":{"type":"demo","days":3},"8d86b4334682d05ed5bee3125493a7e29c4bda33cf7a7ea8531bd285213ea95f":{"type":"demo","days":3},"f9e4129fd95893a979aa891d7bbf6b5065a5ddb88e0acde8f81b3b8d529e65c2":{"type":"demo","days":3},"8a71b4ea2d254526d07e4e5b1548af151eacb160e819a87ec27ac42739d3ab3a":{"type":"demo","days":3},"d3c512d27ee81024d8e9559d198c9ce3233b1ab13786506af0cea656924b75bf":{"type":"demo","days":3},"def1027cc0a27a7150e4a95a2337a83cb212c49e6b1a8f403d54ee17f5b1b6d6":{"type":"demo","days":3},"8f6d8ba4f07fe96280fd3bc8a5412aa6653dfc35dfc519da6a07f79266c90496":{"type":"demo","days":3},"473e813440c08fa8bc9a6fdd62dafb087ca6b9c718c16791b1a703691989fdb0":{"type":"demo","days":3},"76ca11866a996740e0a8546916dca3bddba8efc94768cb50fba211406caa92fa":{"type":"demo","days":3},"42e3fbebbec3cdf76c9acc236d82c0b30a12784903bcab2c479e20b8736cb7ff":{"type":"demo","days":3},"d263f4fc70adfefdb83b21136ad8bb9edb3b29501d0b1a4691340d1239c67148":{"type":"demo","days":3},"31de14bcf8b1614aa946351a7ec4d67dd78142b97a969220595feb0ae1a27975":{"type":"demo","days":3},"ccee096d5e22af7c53117e84d42b6074e7e37ee06fc6162ebf607803805f0441":{"type":"demo","days":3},"6649856ca3bb509d4b9a68013742cc6f4cdd235105c73a27fe72d226bcff741f":{"type":"demo","days":3},"4e2583cd935e1f1c62e7e1ea702257bb5d5af713d979cf22f54880e3e3fd83ad":{"type":"demo","days":3},"0e947416e83af29fec74f448f8945c3234647836e59d2077ac6d97c176adae0d":{"type":"demo","days":3},"84bb858397d2e6bfc44c724da70e9f4af5c84b9a0bd562b86df4a4c7196f2f4d":{"type":"demo","days":3},"dd1bf634c12710f3c88c0a27c90f5357a45682cf9873d01e78e1d72b6669872c":{"type":"demo","days":3},"9ad506146ff0830c177e0c38a3166f9147fa50a9769d6caf819b1015a529762c":{"type":"demo","days":3},"c1505ed54f45212b60019fac9f07f68ed5dcb366e2b28bd671d44a5d7960f534":{"type":"demo","days":3},"bdd9717a499c8fbb8b9d9db22261fb2213ef9e97a193efccca5b62c9414b84e7":{"type":"demo","days":3},"4c5c7f5c8ae4d3aef3958c0d7d77505bef3eb08a8292de7f048be30fecdfed32":{"type":"demo","days":3},"26fece29668fb9875e9989f4c57fb2d7fecfada46757a46ae2c996f3c60f272f":{"type":"demo","days":3},"21d49c325c410636e193f7fc186df499fdc72af796db593bb24573351c7a833c":{"type":"demo","days":3},"d014073ea0917108a692bbad5cc0b657e17ecbe1e64a58806770205ffa3aacc3":{"type":"demo","days":3},"fa406ea2e2bfad22480b9ae2f5138f4b3dfd86f70884ab63360fce62a3229d14":{"type":"demo","days":3},"b84de4665b633e2a2c198aa674ac4ef44697a63d6602189fee1fd8710edd29e3":{"type":"demo","days":3},"9f7d5d8f60bf933a4c6c8f82ee4e5308e7529529b108ea308863082a8722eba9":{"type":"demo","days":3},"57a0856556a6f1d101e402b7186fb40cece3c15aef2d56c2a0887ba6903c50d9":{"type":"demo","days":3},"49151b03bac547eeff44056e84c9fa2f7a76f63313ca88debafbff6cb6cb2575":{"type":"demo","days":3},"444f0afc5dfe8e0e0d5ccf6c3eea102ec36221cf73b86a4d60d65dc80585d381":{"type":"demo","days":3},"c948b16d437d9fdb0c38a3b479fe1e54c7ca276f874c2d6854a924b53b04bcfc":{"type":"demo","days":3},"c19864a0bc06b0c7e19ac51229ca991d1ed9c0cd003330fa3461be6e024ec649":{"type":"demo","days":3},"c771c7a71e80f2559f6f9d6a93a8049968df35cf154ca80b2eaed52066f1c6dd":{"type":"demo","days":3},"2086e04c0ffefc1ee559bcd55d33e93445ded16f3c21af5c9db148835019f56a":{"type":"demo","days":3},"d4e69cb380b291aebbd91bf05365e619b97d7e59ec49aa1fca2760e34a51a6e7":{"type":"demo","days":3},"829da226e8d307b8da75b59ca8773a97b30edd9621ec8cd2a08b6bf46cc2ad74":{"type":"demo","days":3},"2b60bd7ad4072890f7f52d7f686c289535aaa089a559fcd252467ba5c892fe8e":{"type":"demo","days":3},"af2bdec0e15663c06b07b6d86585df79a07b207d31afa3cb80b32f3d37a77f46":{"type":"demo","days":3},"ed90d9a1b0b2a69bacaae1dfe57411323eff0330f974f9aabf788f4743764bc3":{"type":"demo","days":3},"1adccadd2f7e61dd757b1056488300f3bb9f2b6acb92192ed109e295b9ff8471":{"type":"demo","days":3},"605d667e1a3ec5110b259e8200da2f1321c53492ef4f7051934c621f305bd3f5":{"type":"demo","days":3},"f94b5083c31e7b1a5ab33abaa96cf293e5f76c51c9d4d793eb06d9128b3057bc":{"type":"demo","days":3},"131c019485aca54f7b8002bece1ae9b0cd01015e47f0cd04aeca966c66dd8414":{"type":"demo","days":3},"efdbc7a40d4187428e8fcee280064e48c4e0b786a4e0bd9d1c044f0093475b0c":{"type":"demo","days":3},"73abe8f23e40ebd1bd9830e9f7bce30ca5dc1b04d7d8b507502b3ced9bdb7042":{"type":"demo","days":3},"3c0db60f296f9dcd4f1e05c9741faa0172f7177ff574eac410b7d2a2080adf0c":{"type":"demo","days":3},"ea452108e55de8f2ebc52bd722653a7aaacbccf6c29e75f838910bdc31790cd2":{"type":"demo","days":3},"6106a7e8a95ac871019d3c776a6e6faa04e470f586b7625e8140eb9115df31c2":{"type":"demo","days":3},"1982ad872a9c5fc515549a1f5f5cb30bfe539bb6735ad360b7488b789d1cb5ca":{"type":"demo","days":3},"9e7407977cd63a8ca4dabd5d83ffb39cf28a085513f49e374295a164add32e6d":{"type":"demo","days":3},"ed6c444413a1bb9f6b4cc18758ab4fa44aa243833f9814aa973fdde0e8696562":{"type":"demo","days":3},"beace4f88775d17c51e8911258d350aff56f12de7c06140ae02d5cd6e2a70a84":{"type":"demo","days":3},"6fcca5809914fd45d4531c53eba351b15e701a01679760de392dde6e5a81eb0a":{"type":"demo","days":3},"ffe88d85a16e6432b3441832182c19fcbc557c6b61ae1c06f466104af333e95d":{"type":"demo","days":3},"18a729099c5ff720fc5f0368a13de65cf74b9388f238f955c1ca0d0ed447172d":{"type":"demo","days":3},"5a212f34df614c441e5741fd185af637581cbd7deb4678df4607f0326397257a":{"type":"demo","days":3},"c97b841703015dc3e872244237402332a5ebe4af090fe2277ea8633690f1fb3c":{"type":"demo","days":3},"636e4f8c518e339a1d2f8ec4e70cc060b973eaf1d88cee5e645f31e4cd03f32c":{"type":"demo","days":3},"b36b54ce3319767599fa1176b08ff9590ffe3ea52be6295ab6283bdfcf4f929f":{"type":"demo","days":3},"61e20f08fd7cc6f034a16c823f0f397506e6a98395a10643d76d093ccfee2a1e":{"type":"demo","days":3},"6984cbb58a4ff2359faf8c2a1c1c8f907a351d50334a28339f164f781ea90d02":{"type":"demo","days":3},"f8e7dd2c2ead7b843e54c088741aeffb86b8e9a13a51d6ddda6d6e6085c396d1":{"type":"demo","days":3},"751478ca8fe350ebc22681e3d0f2723027ca13d255af9cf0d8535b836df06294":{"type":"demo","days":3},"830918e5b59fbe96e1f88243fd8b624264ef1dce1167b4c4a9e889f4685dac4e":{"type":"demo","days":3},"88c7b70a8ec26c1405f9fc6959e45b64c8082995ae4cc0d07dbd409f1a77dad0":{"type":"demo","days":3},"64ce279122cb1304f787f34a14546f32ff05ffe845051ba8e997000d82977b3f":{"type":"demo","days":3},"4a233fea988434a759adc5bc98551ef8dfdac08a55d52b580abe5c77d826f462":{"type":"demo","days":3},"67e310860a420fd41fe30bb95e45c8ee9289720508cfde509b115df5c149d38c":{"type":"demo","days":3},"8de5ac854f21f7b0e822a19dc44d4cbda249ab7057e136aaae0918151e7464c3":{"type":"demo","days":3},"d96df156cb19686cef407c6eb830cbfb64914c25156c7352697c61821bfbe13b":{"type":"demo","days":3},"2cad51a6e1429d79926a9b68c95075c182f99dd880eb4423eee3c18028ef3b01":{"type":"demo","days":3},"9011a6433dfc8ab2a2296ff9a0bc7ae305173318f3c7fd9624185d5c6fadab5b":{"type":"demo","days":3},"4094661f22aecc24f5c135be1b125aa4282a8fbfba5214db1f095e80f5feacac":{"type":"demo","days":3},"0e468ecb5a500af34018f6484edc94b2d5d650cd22422e2b8305370e5642073e":{"type":"demo","days":3},"dd0388916ee571477c58e181823f1e6920c237a43808aafffed408f0c7a2d23a":{"type":"demo","days":3},"0ce6b0b337b89c251a58f1370628843f14ba0b59f3718b531af3ac4febc7e463":{"type":"demo","days":3},"307e02dcf171e7b3cff8036cd6b6a32f956a6a84b42c4fe2d98a24b1e4a892f7":{"type":"demo","days":3},"552cec7adf7af01cdb6f265c4c8da01d1d98cf0603521dba5493e91f778487e7":{"type":"demo","days":3},"e52dbf5b1347fa4a6be5673c2f5bbf67212f3958c6cbc52d52d96f79cc0aee5f":{"type":"demo","days":3},"1cec9abf5ab30ece533bd255a3ebcd73f856e0185b00225e26f8e71b8ebbbb13":{"type":"demo","days":3},"c96a54edf3d685e41c78f6882af19ea5f4be569d700fe8e2be4b65aeff427fd9":{"type":"demo","days":3},"656b6ebff9f089d91bd0e6a988fc7889735a0680f74d0945c0d29b8b857c850f":{"type":"demo","days":3},"5c262141fdc3c29b8d2054912ea00f4c268f6a03b1224c2ee8b72cd6881ca07f":{"type":"demo","days":3},"43e28b59be1b23d5f6f631e221f53ad093118cb513bdff15a248ad1722a4bf67":{"type":"demo","days":3},"f92d834c8bdf0f1dac29c3a6fba025b81ecebcaa2c64247993c9e5580a401e34":{"type":"demo","days":3},"e0ab796f865db6f70ad2f86739630a99c50fb4a65a6fce862d33245ae0b64d90":{"type":"demo","days":3},"4002643bd58d778d8af48f3d86e7393946f0674cba15831b335cd98a97911cda":{"type":"demo","days":3},"cbebce2c7f622c5603138d9fd57f562a33cf75ab59637e4bbb2710c60cda5809":{"type":"demo","days":3},"a8ce06a21132dd0fc8824a2230fb148be1d42bdc8ffd5bc11012260cbeacfa9c":{"type":"demo","days":3},"910708d826fd39e0ea4b1115a9046ebc08ee4f6a6556866c214d7cd5b3dedadf":{"type":"demo","days":3},"4480ebb86d1298a5a9ddc2ddcb319545efa0e5f784747ad1b5e4396b67dc92a4":{"type":"demo","days":3},"2e5b54a5842a869a9e8bcfe9665b55e57beebdea9f26d3d440010f2bdb816ba9":{"type":"demo","days":3},"4845ff761ac5e224c28a0009fac294d32215d3627a12357dad364876a23b7b54":{"type":"demo","days":3},"5827c88800e6397e16e1d5473d78d299d758c3176ff8a4441e1812b1c21ae4dc":{"type":"demo","days":3},"f69a8d56bbe4a5150ca90b2e4053e74141f76c9050b3329b634270582aac389e":{"type":"demo","days":3},"1df66763fa7451216b6f2666a658ffc223319906a2a306de3bb4b29f41b4a21d":{"type":"demo","days":3},"34209fba58c0414dc1e233af84542b9fb1067f184327a3f0b7edf6df8de01941":{"type":"demo","days":3},"5fd62037c050de5ca39dc06a7e53ae94f48b262995801f2719bd425eb942fd47":{"type":"demo","days":3},"925924cce89c158ad6d929ec450b55c577891c500416bdc9774866c1afbbcfac":{"type":"demo","days":3},"355181795c7ea84227345937d339181c7f8a95b2d642fcfd22bc0100c79557b9":{"type":"demo","days":3},"d8c61b95fb447c7032235a0d2ece0ce215f2e57c9d2ba8caf30da1701f7da781":{"type":"demo","days":3},"a622ba781761677ed0017faa4902f493354a4f66086811cb72504474bfcc1b2a":{"type":"demo","days":3},"edd4f1966e21852a92dc580d23e047ed9800b64a405f4d0d7887da9dcc616590":{"type":"demo","days":3},"6328e06ff932f9f2971d7e1a46ad5d303c9639a72ab423f5b0cc1537ec57bce0":{"type":"demo","days":3},"83339ab7b82791833e8050e33b4c29b75c143a33c7121ba23f475c6957d5fa6d":{"type":"demo","days":3},"9aeb01c5d9966f25972731350271f79eb756d2e2fbd6fc048c50395521905540":{"type":"demo","days":3},"81fd7a862e95226f0f0695e8d2114869a443e5a128eb480452535ff39382c92f":{"type":"demo","days":3},"e9a0dc08abee8431afc4cfe910eb8c71d46e8662b095093b16ff23af6b23a73b":{"type":"demo","days":3},"a39c57528f16582db2399ede877f314b4c1198ebf9c870d40f49d230c2b6c5e0":{"type":"demo","days":3},"34299f0de6db7e0e953ed28b3f901e5e1e35a2126f140413c881747dbf2062f8":{"type":"demo","days":3},"3186b099f3c1dbeb5d82712e9b3121d38be03d06eea98e8c5bbd7634b549e221":{"type":"demo","days":3},"77ea1ac75b30a0f9fe6da452b740f4728412d8cc04af54d6afb53fd31b0a0f8a":{"type":"demo","days":3},"fa4b7a603dd054c71a5eef38b49bc183c53971373d8a8ef416978b77a1f65edd":{"type":"demo","days":3},"e3580c2e2fedbbe02e6fc13795c63f6ed7db09314c65d9a1a7b364603d539fba":{"type":"demo","days":3},"b407c1da5f8ac9c0787a398eba70095eefcc15498018bd7ae806305436aa0b3a":{"type":"demo","days":3},"6d293ccdb7b87f156fb487b1e5fad39681732621aa3a44c5a495e94082caf558":{"type":"demo","days":3},"7f83e635869ca0e8a29b9812a5b060b499b4204c1fb19e25e7d50b7166cdbf18":{"type":"demo","days":3},"c43927ddb78062a790afea59ad55a19748db20adb4ea922ed050e76074792009":{"type":"demo","days":3},"ab4df23c4345eda50321d7d778a26854b223dd7dc6b22e8a09c17bb73cf95a45":{"type":"demo","days":3},"aedc8cdcc23debc28010af81a26916ecc2738f687089d193b56c18ff18501bda":{"type":"demo","days":3},"ca7a58aacb8d9d836e3158763065d17d0bd55ff85024f445b4b78eee75236fe7":{"type":"demo","days":3},"dba7828e3e22c1bd097d171b4731b0911da18fea1f7ba1092819d52f6014b043":{"type":"demo","days":3},"ccbaf2526a53cab359cc63cac0a53e0b35ee49e1100a9db0315c920d68d8a047":{"type":"demo","days":3},"c4856c423d6b07df5822418bfafc3d0865bbc2dafe68bfea85c739c020f6cf63":{"type":"demo","days":3},"6e51598f525c2987008f74d0f55ecfd20633f5853617ca34b080ebf8a89507d3":{"type":"demo","days":3},"641bb701bc6a65c663c7f1c6654bd1704a6618d4542ceda6e8baf418751cf2e4":{"type":"demo","days":3},"018b11c72d3a3700173647a8b61c8a7c0f4b402f1cf196247c522069aa2617cd":{"type":"demo","days":3},"6176fdfe79e034bc4201b790ac0ca4112dae5267d1cf1ae5dd9687af572609e3":{"type":"demo","days":3},"8c6fb1f5d4d850f688a50c03924608913cb3148d9f6c31d79dde593203c59550":{"type":"demo","days":3},"3abba97c0b73ffb176808ee3708406a735353391720a9b5920681012a4b029b4":{"type":"demo","days":3},"e161b072c91d653138ff0d4d5dcbbf32b8a20f1fcb90a192e875ab07ab5a8329":{"type":"demo","days":3},"08bd3f67e41960cc48638c54b9b2aa8107f6b8b8564940bcb41029d002e3597b":{"type":"demo","days":3},"3afa2c593775048c057d39d31e9d43cbfb78520fc460312659d8a54dd4dcd426":{"type":"demo","days":3},"b998a38b2f1f17ae7904b70d7276fdf4f203fd1aa1ff8bbfd006be1a3e6ec5bf":{"type":"demo","days":3},"3874254b760b7358b11d261fb498ad134c052ef0ef29d1576cdf3436f62e5232":{"type":"demo","days":3},"d17124e02c22ab6ed7922397b31ad2b8f97e2f10fe5737776c8424b2b7ecd422":{"type":"demo","days":3},"ee59cc6e04f6157362ac194b4bf551fc803c8e0f5e010da5ac9386e79528bdc3":{"type":"demo","days":3},"acafb7c5028db25d0de82388e79617dac5ac2291e1893798dff169af810b0dec":{"type":"demo","days":3},"86da1f8b7bc4be2651bc210cc1bda37850d6968d82ca8047a8c39be0e0e95c5d":{"type":"demo","days":3},"ede7e787bd56e4abd22ad05467233be4a85664ad6740312762809f2efa37ba62":{"type":"demo","days":3},"a98321070908d8552c0b8590aa836585dd9be94f6f72cc49c5a2c30c919c7de3":{"type":"demo","days":3},"bc0a50ff897bc7648ccf17b05797534c673b1b9af378101ff76a94611863571a":{"type":"demo","days":3},"47b121873b3f6965a9f7689a2ccac343b5c0c05b59ffdfb1bb73bddb6403aaf0":{"type":"demo","days":3},"49aef323162747cc81d316f867a2149306aa115d8f754bb6f9fd5fde41480a41":{"type":"demo","days":3},"3f0d6560a838f13a9fd1142952ca7465896dc749fa7f8ffa56c517eb1d94004e":{"type":"demo","days":3},"e929da0b5e5683221e158a2e2dd67a29459ea7ab2396295db0bc5d6a54aeb3b1":{"type":"demo","days":3},"2d8e3878a6fcf52f05333ef6a9cfb3a866e42729202a944275fde9a9cd38e78d":{"type":"demo","days":3},"47c6dde4fb65764f1398c591629c5a93cc8707b1851b75d17f4037df5e99ea5f":{"type":"demo","days":3},"f978c617b8b6c680c1188077c21fc1d4ad5997aca20d7080433f7de0d5c459ad":{"type":"demo","days":3},"fbe1464bf1124628d06fc1e5f83488c293f44917cba6828b27f942eeb6aea0c8":{"type":"demo","days":3},"8cb1ab21c6e7c4068602051613f73ed1da27e61681a003928e5cc719a6ca86fe":{"type":"demo","days":3},"67991747e01a10ecbe0058d4011e16232ee1342150a29c2b0ea7f60b23fbae92":{"type":"demo","days":3},"ceb43c681a95de11884b00b936cdf90baf54fb6abdb5f54952f719237013fa54":{"type":"demo","days":3},"1ad8a3875e1ad9d46be49eaa5a456a9fe141b267982d774578824dbe34dcc02b":{"type":"demo","days":3},"9bc176be2da27a55b3041e00f7715edce3e83628a97d1825158bcfd43b54a169":{"type":"demo","days":3},"21e77d366abbc2141929454fbc92a3b4d5ca8dde362c432ba9252c3cb8cf01f4":{"type":"demo","days":3},"d7f4eb86be83ebc91a7520f8670b5f0c4629912b443548c1ba83b9fdc8ca2e5d":{"type":"demo","days":3},"2123241473981230a57b5dd005d225e021376f75090dcf1ed6f706914beedc09":{"type":"demo","days":3},"c4e8179227fd069f06441c0381e6d6e9a1189c854362519d2c26918da3339b0b":{"type":"demo","days":3},"1e03f478423dbaf98f4b0dd7e6173b0ecf8053226209e1b7e1891fd21ca83d16":{"type":"demo","days":3},"ce32eee593d122a62c3cb485481c0d9226274bc14ecac74789f0db339a2b91a4":{"type":"demo","days":3},"a12ad9d655aa45fc73cbec0b7ef40207da3238cd7985e6c9df4377d8d83ba175":{"type":"demo","days":3},"fd2e6a5aed623723c3ae236d7189a1e2e34ae3d94c82d60fcc678f76924b84b6":{"type":"demo","days":3},"e76baf4359cdfa4eb17a66d7adcc1249aa272269fb037eb6685a203993183c61":{"type":"demo","days":3},"6d67779c2591cd6d56748e3f67fda5e5ab32fa0581033c9c18e374fd77405c0d":{"type":"demo","days":3},"eac5f2186c75af7233b7857e0cf05c142e605bd67cf7ad10b35d75fa80ac65f4":{"type":"demo","days":3},"9035d759e0d9f76efd5642cfaf16a6053264afa373e6f2c745acff2cbff752cc":{"type":"demo","days":3},"b2b0c510bf15a68781601a1303a087895cdbc6a79056be5e61fc22e5bb920336":{"type":"demo","days":3},"1a3b8ea8712c2d94575bd60f133b0cf2dff95d7574ba8f5c6b16de6081b26f0b":{"type":"demo","days":3},"9512d304b6b0afb44885b8e889d9e5ba3a3a535b63e97749b1f1979bbc19933f":{"type":"demo","days":3},"386eb2c8892b06913cfebfe2d5f0ca85e29874e3e5d02f0c9675daf9a86f1393":{"type":"demo","days":3},"3a2a818e76b23c1237afe7d19c3a1666a0cc0213fb1a5ad71cf892d299276df8":{"type":"demo","days":3},"2d579aec768d98a0bb230f55883aed77406bb5787e9f0d27bf04b2e0e9269488":{"type":"demo","days":3},"3df57debbfcec1e501269c31c8b2b6a9269285cdd76def0b101719801201b332":{"type":"demo","days":3},"3be1966cfb4d994ab749e10793f698b9d3a89c47c10bb90ba49a4ae668118ae1":{"type":"demo","days":3},"b965ae925aa30647be87ce258f89f5f72d9bc91b3b2c3e9c583e47439d9587b4":{"type":"demo","days":3},"899c89b2a23136d65506ae90a3efc01a6a0b7c17016a37f32105615295e34b42":{"type":"demo","days":3},"d03f976e27365ec1a7037b500b4d9402b18c8bc6f06de72f72e5b151ee784258":{"type":"demo","days":3},"698bc09581a6b57709b9f1bc636758c0fbacc65430c44eeab46a68a43256c9e3":{"type":"demo","days":3},"fadf0fe04c5b0964d802495a81e8c9f44108f6f3dd115f92ce9439f43ba02465":{"type":"demo","days":3},"564c07a89dd1a2eb6c99e85feba06c6826c317b6a4c10fab0a143a6b83a1920b":{"type":"demo","days":3},"f8e4aefffef99316ca468f2d329ee426e5a77211ef34cb558c150beb208a21b1":{"type":"demo","days":3},"98c5a0a18d8a3a569c4d9ef2d89d52f53b2b0145df9789632c4df9d19db265d2":{"type":"demo","days":3},"0182f1e749edf863de141c8c6922a0ba991e31c95827501cffcd0f948800e43a":{"type":"demo","days":3},"a3494349d5895819a8d207bc882c0e70210cc6fa151af57696d85142f3077a12":{"type":"demo","days":3},"00a01d0491b0332efbb0cdffdaa09c8b5c197ddfbb682ebba796258ef1e285f3":{"type":"demo","days":3},"8f33c0eb2725d2a53c54335c753cecc3a97052c47a7a6f69c6c9f02f20718c59":{"type":"demo","days":3},"eb236db3abb6d7e472f5762fe6832501072ce8d9608532f0a1f84184a3760e24":{"type":"demo","days":3},"297d77f6461753d2492227f63a0f8a8982fd98f9a149ca209ee2a4ce8ae846a1":{"type":"demo","days":3},"d9b95e58855a3f4ae1d41d34e856cdcd6ddc467956223f04e4875ff65ad5a7ad":{"type":"demo","days":3},"f4301d5703e94da04b787bd5a80fe8e815334c587d137c7533d546fb417139bb":{"type":"demo","days":3},"d3a2fdff167fe288fc6cd287fe17f85ec6e4790c11e530dcf70001bd5ae538ee":{"type":"demo","days":3},"ef66c1d3301ac4f884f73f6531b1a9d09c8d8a8b69fbfa9df7ab95a2ac956519":{"type":"demo","days":3},"fbec2a50756d872a9ce4cf64dddbf24a0ec483cb5d638c1c5ba9e2d3cdb9c92d":{"type":"demo","days":3},"c30f0a19563d8024b47a6782178ed822b910f6218a4017daa2ba7e66d9a9251a":{"type":"demo","days":3},"869ec7f68049b374df4b4bc98704168b50f61e57f768280ae849c65c5d0fdc96":{"type":"demo","days":3},"a352738529074577f3166e825ecb6517f617988c3b814093d0bebf558eafc4b0":{"type":"demo","days":3},"7102df80cdbfeff785df3ccf51a61f036991e1531ebfe338a004c0d9bff3742e":{"type":"demo","days":3},"ae608af5c4b159d64a130eb2e7b4067ffa5b5674ec161f7933feae52f5a8609d":{"type":"demo","days":3},"b2ef0932f2cdec9b94d0bd11dddf490e229f2efa338264b4ba15cad0ea48db18":{"type":"demo","days":3},"17fab5c0edd09e332f41c923c48a1e4a51994d050de1aaca8d47895ec52d5acb":{"type":"demo","days":3},"54445651bfb17c70233227e890eb17e99fc5306f18aa72f21e576172e749946a":{"type":"demo","days":3},"66841d58c5865a3030e29fdbfe10548492716b32a14cd34fe191a1138ab05177":{"type":"demo","days":3},"d5e8c2d402effcc241dca335878e2840e7b3c980459270b0111eca9506ded1f4":{"type":"demo","days":3},"c87ca21c96392c1f3dac278c1d035ee81a0c268a5019eeb326a80679d6758d1b":{"type":"demo","days":3},"a173ccb6534ea01ef735bb375f681ebabceb0fdb24922e78ee5ed19a99cfe746":{"type":"demo","days":3},"a71805fbb57e1d2fbea45911cff2dcc7876592180a3085bf2ac9ebbfea61d331":{"type":"demo","days":3},"dba739f19d3f2a605fed5e1fc8a6a446c45ea5ba65be12b2d84a7e1f14f992e4":{"type":"demo","days":3},"2518ae57638c5ea5183415ed56cf284f513bf452d819052fb1a9a5bc4a6a8205":{"type":"demo","days":3},"3dfca095a4844b17cd0bbef2e421a9e2bdaea89e81ec25ad8bbb0f78eefa3860":{"type":"demo","days":3},"58c3611fef0dcd7330f35aed345999f2ca6a580fa897938da1fefd8e410088d6":{"type":"demo","days":3},"5192f7988ad650851d3a8c5e7b3171d4e7ff04a0bf938235db767e7de28bad04":{"type":"demo","days":3},"7b1bdd625efad5861fd8fcaf06ca1a00728e23bcf9bb0fb466da657018340944":{"type":"demo","days":3},"18744a746592598d44981e7f83016a3e5a09fdf23fb3ff7e350017e22e4718ac":{"type":"demo","days":3},"8fc67710bd2f46d8788aeee1982bb16384b03a58d3a7a339c79efbd7fc4fe2d3":{"type":"demo","days":3},"25b9a4713974b440997c8fabb8d5ab83d30180f5c6eb25d5980745c69cc35fca":{"type":"demo","days":3},"a87eddd5d4a4b89540f4c6557628528390e1ef0596733066f196ee98ebb0aeb5":{"type":"demo","days":3},"37111dc1422173da0017bd4da5f73578ed3918a6ddc2e93096965abad402369f":{"type":"demo","days":3},"43273ec96485f3842421d6ad9882341a869fc6ff4880a19db902f7a490b8f0d2":{"type":"demo","days":3},"a48f667588bbdd661caab752fcb08d9e980fdf448f91f938b76db80d7656df3a":{"type":"demo","days":3},"6f18329c4182aa85f76af2b71b28bfe5c0d1abcd01d075a5f78022d2c4312843":{"type":"demo","days":3},"42c0b51dfde30ce2a84f590440587491b26f71ba3da05ad2d4c0f52389da2522":{"type":"demo","days":3},"9d6b238083051a8aee710b6a58233fa5665011bb5c2489a65625ac4eea879b22":{"type":"demo","days":3},"757b71d9ff6e8a7ff6e651bfd0522906dee3d2600e834fe538d13feead87c605":{"type":"demo","days":3},"4fbec3da07e217db29808eed16eeeb5cdf31ded3cdd9ed190bfdb3d16d9a8250":{"type":"demo","days":3},"8c38091fba17e36e3a502c330d9f295e936b296028bfd040fcbe45295524606e":{"type":"demo","days":3},"615d0dd7eb94a7c78aee2bf9f82f64dd0a17592a6f7eeee638541f386b49daaa":{"type":"demo","days":3},"e3b5bf5131714c0e1b482fc99ec6c4cc757526cad0f192c129b5cbc7e12ab041":{"type":"demo","days":3},"ea2eb470ba0d26d960bfeda6a9603528732ac2133be5adce383ec0e19073640d":{"type":"demo","days":3},"8f9cdfc85666223e033c4335f310d99276e95a17733cd10d87c864122f0a49d2":{"type":"demo","days":3},"2cb03fdcce35e586592f397cf9ef40f46cbcc910080e5c545fc09f5c8fa616cf":{"type":"demo","days":3},"3a68b198bd7422a338675a73ada055d8561bd70147bc32ab31f954233f25a2ba":{"type":"demo","days":3},"2a0088c6406f210c7d915ce00ae6b99a30b7af40268568493c972aec4083f6fb":{"type":"demo","days":3},"703a439e002c0323465ac7974ce509ccb5c602850bb83dbb00eec75b967c652a":{"type":"demo","days":3},"420adb55a338fabb54f233be32aff15243196714c0aa2070eb785a49cfa94f51":{"type":"demo","days":3},"70cb3acb3be6d41d50fa10a3b4fcc4a79d8813daa6768d08ea7789644c45c9f1":{"type":"demo","days":3},"5e11a9f614f929675f65cd392021e392b501f08e17f3e9b804a71933b2e1d37b":{"type":"demo","days":3},"079b90949aa2bd9f86c145811dc9120681cc9602e6c2459f8612861e85dfbb7a":{"type":"demo","days":3},"525c918bc93e51eb5d77c0cdab1ea10ba183431e169e307b694b72d12172cf82":{"type":"demo","days":3},"ad9131ab11a611cdfca943775fd07a0652e33382851d60766777d83af3a29756":{"type":"demo","days":3},"6d5e835c0d9da834e00aca2955367d8c5f0d29834c97614a90ba8f5d8cceebf9":{"type":"demo","days":3},"af3c7e233340d9a61a81c9d2c4fb2645ccf711a34d31a48867058f45af04b551":{"type":"demo","days":3},"27c071887ee60f8f8a4b52b8c3876e2cc69314fa94fb4a5a15d4d3d391a0c200":{"type":"demo","days":3},"9cea2e33eafcc58e8770c585c4463b8c51b5fbd8921d4d8e0aa301fa9061a57c":{"type":"demo","days":3},"43b0407529cc3b0d673ff85c16e5e89e629ba854208ad45256cfce6d20ff392d":{"type":"demo","days":3},"7fcdd66fb2db04bdd9f857f4398653820d58857a624430a483cf87f67a931cc0":{"type":"demo","days":3},"ae4549cfc1838c41f72ee4df97c2e47ecea8c4d68e12d0651f3f65bad861bb1b":{"type":"demo","days":3},"aa6ef0f14c24dc945753efb469d83763ec5f363272e1a11543f038a1d8ded354":{"type":"demo","days":3},"7f2067aa4e0c44759b2fa0dfe95c7495778f1dcc639b1017dcb7fd3758f5a9ad":{"type":"demo","days":3},"1684f158e6aae11c3b98c2234e1812312dea922fa024f263220806246f0ca2b6":{"type":"demo","days":3},"8e3f08ec127f4d78323e421ef5025a97a55cbb195240f6296f0afda98a82b09c":{"type":"demo","days":3},"a48f2fab11e95dff64966bd5c332f279d71e9750f1626adbada5a95a2bddfc89":{"type":"demo","days":3},"7e4227e450dfafe59ab804b74beb15bd8d50873bbe8a5a9a6615c0051264320f":{"type":"demo","days":3},"0c568ea7729b60043a5edab71046e19e22a076bb2bb66fc94db3c65d5a3ade22":{"type":"demo","days":3},"086b8a365d257eb1f5aeeb3201f1256babeb82f04a53ffdb57ec0f83d62477c6":{"type":"demo","days":3},"428ac3675d075bbda876a019236b9b06a973b054832789318a5fa289b353861b":{"type":"demo","days":3},"c63e1477c63f9dd7d57016e3744344c28d4d602cd86d72b2d5eb9a6d9479cb4c":{"type":"demo","days":3},"574ff7e58b1954ef60c45f17a891788a7a207ff49f2327f0c528a3cbc3434c3f":{"type":"demo","days":3},"5ac38736c026a1e110d0215eaa949f1adb3eca585055cff5f77a5bf2d327231c":{"type":"demo","days":3},"1a02a22d473d2cf9e4baef5307b75e49b6aeceb1f11ee3732fd0d7a79ed819da":{"type":"demo","days":3},"a4ebac6622be20a2944c83bce964c62211aa895b2f81d6de23e49747481c37b4":{"type":"demo","days":3},"858a39a55c937ccc54281a5b35bd7ba7538cb112ec9274e3f6e30e53403edde8":{"type":"demo","days":3},"a917be3ef7b4085a390e0e872e1410decc14d22e82db6d47d185b5bca88ca5de":{"type":"demo","days":3},"1d3d84850f9e60eaaf4722997bdb900f1316e998966373652efb92d3f74cbe10":{"type":"demo","days":3},"54be2b74ad3fe162b6aae644820c730636b6af903d82aee340bf13b390ed8aa9":{"type":"demo","days":3},"de77c961e61a7c3e52b6c0f7b0283cd1b82730dffb9b21cecfb0777003224103":{"type":"demo","days":3},"719725366d89d011615885162d925f596e0d794113980114dc1b4e24423117ae":{"type":"demo","days":3},"4baac62fbf3ee4369bc7eed08f80370a57647275fef3f4e2fee6dc564d9782c7":{"type":"demo","days":3},"9cf313ba5ec538fc8612350368bb8d69f897893f1a2d47b5d4f960aba8874570":{"type":"demo","days":3},"01d01bd421774890f0a0fa7017cddea40c0207875d0f10e1d45579f3ff7b97e6":{"type":"demo","days":3},"ef6d769ee1719a357ae69c7b8cad4c7331a58accfb909afb95cb836339c2cc3d":{"type":"demo","days":3},"b85e1f1b475666ab1107e32ea5786f6b129801cb921776726f8a396f2e1d4d29":{"type":"demo","days":3},"1f272a152bd2e0f2b9ecef17bcd06c6d1d2d85f8c80f10247f6b04853bd41d75":{"type":"demo","days":3},"000c76e576b455231029ccea91bf6b30ce037e486dad204eb313f287e5001897":{"type":"demo","days":3},"7a977ee53c560d7f1aef5a738d7612fdfb979c18005155dbd2910b2b9358f89b":{"type":"demo","days":3},"92d92278765b07fd3febc8beac222bfe0d2a5dcc8f1232b41860d11547f64905":{"type":"demo","days":3},"3a566c53e2ace171fd6c1a7e75e85545b1e4f00309109ec458bf7b93df9786d1":{"type":"demo","days":3},"4f6769e886c6aa38c7c62c4afae230fd2f93bbc60567c96aca63bbd01167c0bc":{"type":"demo","days":3},"21426d8d9c90f1bb23f1c09e56ac5921a5822c63e23f2e33e964f5040b65a499":{"type":"demo","days":3},"05cad6baf5f7ab8f2609a9840744f31c79ce3824e785acb3fc9ef7c9152a85f6":{"type":"demo","days":3},"d8b8243b053bc12f5c374a19d8b82e863db898db7363210a62605c6f72fd67cb":{"type":"demo","days":3},"b30723752f5bd9e6cf0d8e6c08e7794e7a5a9c03777b884265880cff87bb1a40":{"type":"demo","days":3},"7ea6b4f53b10dda51f949bd565d46b306931e40f8f630fc39ee9ea19e8b87880":{"type":"demo","days":3},"91b4b4c5bb53caca0fc9ba7b7197b768f73038946a51edc11fcffad08fcdb8de":{"type":"demo","days":3},"bbd34aa5629deecbd546b87f60f068db24f0a28af86aedc64a68fb0df3d0b0c8":{"type":"demo","days":3},"5ff1f7ec0c72c130dbd60f04064ea3067fddd08878c83cef3ccdbd59f167218f":{"type":"demo","days":3},"012f6c1a0daadeed6bcfc3b73ff5df0a3241e3047eb4986bf941971adf0f88d5":{"type":"demo","days":3},"3728309b4451ada87c9e0f8524fc5e52bb5bba89518b57796a0e39c704047ab6":{"type":"demo","days":3},"1e7d99f08182ee76f5e4f0d63e069a2cea839546c57b93999308e734f91e5dad":{"type":"demo","days":3},"cf7701c9289cfe00cf25e732be8b7bbdc01bc5c7d88aac3dad2981db3ea8f9f1":{"type":"demo","days":3},"e18c0d9009f4184194da9ada5fc7a7f75c23f28b8959394c6d553951c48e8612":{"type":"demo","days":3},"929309df867aa366281044490b693f1d86b78e7532bf8e0b46d1642e35a76dea":{"type":"demo","days":3},"a5822c1b738993836f56536b0aa0aa3d25007210d6f9a1220fd7d713b34f865c":{"type":"demo","days":3},"d092b53f444d86190ee0fdeaa006abcb5b5208bfcfc014f1ee0958eff820e511":{"type":"demo","days":3},"dd646d6e95714b8ce5888853813def664b9342bdafef6f9eee65b24bbc5bd0af":{"type":"demo","days":3},"98bef379ed9f13c3ec04f3765359100c0310587c7261a31c354efbe2c3ab7117":{"type":"demo","days":3},"b35af10290cb5949bd0853790a699e5d305340df5b3e87b40732547cd3180483":{"type":"demo","days":3},"6f86fdb80a289bcc67d4bf059714c1f5d9bd8f4c512b597f597aee81b369ee7e":{"type":"demo","days":3},"1ae25043673f7e348834ec4fce4f5f8551c32744bdd7fd2cc4fc20096bd5403c":{"type":"demo","days":3},"1851cb36c535ec97af2db269b2e048c8c620c30407fe3c7508191c4ad1fa3626":{"type":"demo","days":3},"856035e4bb6d9c7e58e144631fcb2cc67f1b59ff3e76cc6e476ffef9b1b4dc84":{"type":"demo","days":3},"0cc4feac28517d58f37f5c4d7087396029f836ac611ca5192b63d8bc1273e84e":{"type":"demo","days":3},"777504a6c5315b657ddb7fccb6e8600f4bc7715159b8d4b987f8b3ecfb4fe4a2":{"type":"demo","days":3},"d059b266103b79f9a7165af6a607f0e8b489848db83cbc85d2cb9df4bec35827":{"type":"demo","days":3},"13a0a6855c1083ae1701916fb060307b8abdc1844ae31d856b5e7bf80d547f05":{"type":"demo","days":3},"4e0f3793a6d12154fb421b8d877a93f5f2323dbd6d97e681eee3683f25f658db":{"type":"demo","days":3},"9533eb17ffb55d1450d0036fc89f037cfe9d5b9bcf558c99039ef725bb657a82":{"type":"demo","days":3},"3a7a2e753ac69bbed8c406c8654d26ab12eaa833f07d6b6e5dcc3b1c1e9b0a21":{"type":"demo","days":3},"4fb4de4eb7572e43207ea2fc032fc840d44b6b7de28981e93dbb055f1a47ea81":{"type":"demo","days":3},"904e8e7a4fc15e15557f64e245d2d1cd33a441499bc6bef3101aae649449fe2b":{"type":"demo","days":3},"91ee142bfb1dadd1f00496215c1d97f4934d1ba8cd35c230c92f51d57175300d":{"type":"demo","days":3},"b5bff37a29ec2d2101b6f3f1eb90fe976b38ca3e7eac86e522f1a4780ca16c36":{"type":"demo","days":3},"6f3bd98d2a7c7aef4fefb2a77b646b9b95efb836b9266e418d097c9558fcc920":{"type":"demo","days":3},"bf10e68b53b5bfe9ab6de52cabc77dea351c25a1c675a2a2691a3d983d1eba9d":{"type":"demo","days":3},"b985f874ad8f1e026c2a74afbcb6fb3fc1346d85407dde96b8076fa56cc9149b":{"type":"demo","days":3},"330e4641793d7efd724a2b318dd5bc088b7695b0169f0d704d38d9ccda0f9b4b":{"type":"demo","days":3},"11590e81b2cd345c80d7bf5591992cf25306fcfd3dfbed3ae392723aec383306":{"type":"demo","days":3},"15837af06fa8024231fd563d656a1b562bdb2e89431b3ad2d9553aa7c76601c1":{"type":"demo","days":3},"788d9e865fe6d4e61a5809f500bd7687e4e20d8c58c2c77130d204cd01a7bf5c":{"type":"demo","days":3},"5ff1789a01d72e0898ca3fbdb18569bcc69bb1c0b382df70fc6cfc9787d66235":{"type":"demo","days":3},"19a1d81d8494c76fce729af57f3919d3356359289b2af4bc27b38ec9dd39bb94":{"type":"demo","days":3},"a66c7bc36f77c0cc067b22a600a2c590343d88146574ad3e1cf0e94d82aa5582":{"type":"demo","days":3},"10aed4dd1cfeba713c942ed16976ae662529fac728410b213534819f83b18b55":{"type":"demo","days":3},"9a248a389099df2aaea92b23c073072d62658366671fa5fbab6dde57f39c1cd3":{"type":"demo","days":3},"e3aea1fea6e1f06d8c5804f70000a22fb7314d53135f2d58aff9a9f931844ea0":{"type":"demo","days":3},"16e214564a5b59d20c90ae5135a1dfe9d38e02d3969ffc0776d42815bb01b77c":{"type":"demo","days":3},"7a68c1e31e66f8912349cafa0656d79c59fdaf2c21035de35e3b20ab5d7af0b3":{"type":"demo","days":3},"36476adc4cc981efee09bffaf241f90417a7be75274373bf91532677e2d02a2d":{"type":"demo","days":3},"f604b135a33ccba56bcacfd73d406bd982c71ee3aacdcada9540ee16ada33d8d":{"type":"demo","days":3},"8a34d2773464240e1569b14271ff2828a728129d46b648163b401fe5f3ad5fc6":{"type":"demo","days":3},"6c29abe43d8a7c5a24afac103dc68780768bca2774442b7e96b54975d7cba3f6":{"type":"demo","days":3},"e1831b8f3e32cfd6fc3e2bb6a8772050dd27e4c4bbc662a7b47a87adf95b48c3":{"type":"demo","days":3},"943628c02c070543868e9c16bf03b2dd726a740b098facd209635ec624308892":{"type":"demo","days":3},"b3e1d41747d0426e92aceb03015e773d3259013a287b508d24f7a49ec42a2c02":{"type":"demo","days":3},"b37c59fcba63701c717098ec609aadf4bf3b9760e8340c701360548cbcdf90ed":{"type":"demo","days":3},"0b6efe9ec1cffbfd58f72ce388c3b5b8942545c2ede2af256059be866f79eebe":{"type":"demo","days":3},"e274deac301b514096329341d9e97a91e3992797eb464165e75cf3d690b315b6":{"type":"demo","days":3},"411d06810a82b11a1bcd820e81377517203982e0a095c8cdb6797880690efb51":{"type":"demo","days":3},"4e22e2d765704fb200d2bde0365828dd016694cca6d2140d28fbbbeea0e3f649":{"type":"demo","days":3},"9048f1d177744cc83c37d94cd518eedbebd49c469a951c27ceb75b45d52c979e":{"type":"demo","days":3},"35806ddc57f6da8086bc5cb28504ec4c25dd50b77d038d4c3ebe9f2791d24306":{"type":"demo","days":3},"7c4bcfb32d0a48e24bb476957ebd114740cad9a1a2a76fa77bbf092b0b3c8f57":{"type":"demo","days":3},"f8d1ffe06db8533921583874f5517ef4cb1e375dc256722e4ee9d07d5e8ede44":{"type":"demo","days":3},"2742e2c74de11c29f5055cd6979f117670e5a30b9f44a132984cf192d6e15844":{"type":"demo","days":3},"9b8a7788e6d4cb5347e094ed4f9581055899c3b112bca9c38477c94671cb1bcb":{"type":"demo","days":3},"18bb6cfa7a07f9278db49d037ef1ed2123a16c2c149787e2ecc3763f3be74c98":{"type":"demo","days":3},"9e06d5863654bceb6f4f2fea6b2b90e3c336004d2ce93612b382047a36f4ef56":{"type":"demo","days":3},"1bda1185c7d4f76e1c07156a138d73b6ab9ea8278b8ec59d81ad4a840d84d957":{"type":"demo","days":3},"94ab9fd9c541577c1bf1d566c419dcb17d01f8e2aaa163e5992c0efe11dffe51":{"type":"demo","days":3},"ccad5a862be02274b42fbbcf3936062a1efd04284e355946cfcd73c56c3df9dd":{"type":"demo","days":3},"4bfee2d4fe2b7e007883ad661a3719d727243c9c5eaa1d82ec8d241b57b1f972":{"type":"demo","days":3},"4b33a163c585627fd29d61e70246e63f8025fc0a8f7b323ec3e8134f7d1ab309":{"type":"demo","days":3},"03cc6e1d252672f14a31b30a0a873520003454ff69891cfc4aada73356a53bf6":{"type":"demo","days":3},"82bda9e8f50fc79f6e421070956fe18c43303ef156e3f96afe273843fcce470c":{"type":"demo","days":3},"d9395dde5c5662b4e3afa3bbed9e9ac08611bee579407bc845f7b95f240791c8":{"type":"demo","days":3},"4ecd6550e5e9996c1f830301ec0c062b32751d6e96846ed589abb9e3d60e74dd":{"type":"demo","days":3},"cb93421ff5530703018e77bd1277b4f20f916cf7e9349bdc6d8b4652aa4d2922":{"type":"demo","days":3},"21cbe2731ff5b3af62e82169f854564a9a5a1321a7550c0034a61673091b683a":{"type":"demo","days":3},"30fd9f2a12d766cabbed13277e592beb23bae1bc511366fd422e8490663997f0":{"type":"demo","days":3},"d342ba8445179fcb913bda035249bedc76437adb339fa4ada4fbaa79153aa96c":{"type":"demo","days":3},"fd69c5d9621c31b1e8819bf11cac5864a79a1172f509b022555c2a6c8f23db00":{"type":"demo","days":3},"36f8cf5eeed7b2d72c95afb8e46517ec2fd9b16db6b55ebb3fbb4498ecd3e4ad":{"type":"demo","days":3},"0684da29e0455b38e8b837dec4007370a166d3a6331a9e9d91d6ba927b385dd7":{"type":"demo","days":3},"ea11b76a25a899b237b35efe37727c3ba45898fc96fc9b650ee463d80665b913":{"type":"demo","days":3},"ead43bfb0f482de999289680a1148c98c960bf2f69cf3c5aaa03347893120589":{"type":"demo","days":3},"0ec28556ab76175452054c6d6ecd786405efe234811368f2d60724cf5043a767":{"type":"demo","days":3},"aa8f5a5005363afe211aceaf95a7cbb283919e6184fbb35eba7bf2205f80f5d1":{"type":"demo","days":3},"2f4107fbb282c1e6a406ca5e9c2c48c9f34a15f52eeb3c210eb8eb220df6cc55":{"type":"demo","days":3},"4c4a2fb661bdc96f85bf0fdade843405a13134391f7f625358bd924b4852cf57":{"type":"demo","days":3},"d10078f3e56d238379087739e55bcbd426839b4ed03af0073055eb402670ac72":{"type":"demo","days":3},"ca42e7c50806a146135c35bb59f3f66c41e494698fb12b0e3743794e28cde7ef":{"type":"demo","days":3},"ae92502562a0a2eb4c3bdd295e95c3efc429ca82370800c5e3a75025d9ffd152":{"type":"demo","days":3},"fad8fcd2a8ebfcd649131947dc384516c797fefebbc0f872d06aa33de64a6824":{"type":"demo","days":3},"08a53424ea550871866b54084ee384ac5489fa5b2c6c6cf110bbde6d8bbc4d29":{"type":"demo","days":3},"5943b133125b89db5af86b7641a43ea1491df32fa752b341a003163efe7e45c7":{"type":"demo","days":3},"9a5626e79ac3b6716e7dc792e6b2df5912bad99c1af9c0999634a6748190c078":{"type":"demo","days":3},"d02bfd2011e451b07db2a288acbf0dc6aaceb05a092e51c67f8facafda584c71":{"type":"demo","days":3},"1d9833cb9df47e153f3d45e9c0baf78646c31c7dbb7c7e2730572e25d938cea2":{"type":"demo","days":3},"b2ce5fb092d6cea700508861ee267739ecc1867709544ee2de38835e27f00b3c":{"type":"demo","days":3},"424da54603e9b3408572ef2fa807dd2c70965f3c2ad6330aaa36efebe791fbf1":{"type":"demo","days":3},"b41116b0712a3d245ae9e3698fc9cf74dbe15157a9573254353b50e78b27662c":{"type":"demo","days":3},"716432dbc68aa78f26b87391949b47ca1e2862f68f0d133eb5b61fad8b515717":{"type":"demo","days":3},"b14ecafd506df70b8ab2528b4f1dee9196f031a65d05b7b80720490f18764b58":{"type":"demo","days":3},"ec4b0188bf792c0354ac7e0bea75e2eea1b031867f5a68e74ffb5e5c1b265980":{"type":"demo","days":3},"de9f7206f34de4b22759e6c6a5f3827ce6775ec72eeeb164db0a4df99cb75833":{"type":"demo","days":3},"ffe84eaebd9f4616f81e678f58874e4db1e2c37919c73346a67cb00e1188d7a3":{"type":"demo","days":3},"5c2f9b9de8f91f788abecbce4000e6469e331cf8a5949c99270e2d44a5c33bfd":{"type":"demo","days":3},"d7c4ac01193bf34e7fc4c35800b0c354186f288bdd5a763b469a5eea53edd3de":{"type":"demo","days":3},"d8815a2580d0482e7745f63bc8643d2fc96394a2f8541539736c4b8d42cd7201":{"type":"demo","days":3},"2148792471a0c2a785e1a9b2ac517dfff0861b5e42201b55304ea4bf994ce5f3":{"type":"demo","days":3},"e54d0d8a26628f71c8ae790f400765484ff12b8931c74e27b2804e24f55321c3":{"type":"demo","days":3},"67b414e7a8879e513684f8354c1c47729e069798a8343b950f6702592f7ddbb5":{"type":"demo","days":3},"ed6f6c8cb0135a9fa25d91b2c93d58350990183aeddd6e4b93f4ff4571985928":{"type":"demo","days":3},"17c03ba433d7e5e0017e406933fa7d95df60bab025c551d5c3929a0aa03723c5":{"type":"demo","days":3},"7fea3efdf748281742cb244a4cc8028bd6aebe7f0a0cea069de49bcd571d53cd":{"type":"demo","days":3},"60069abd24893d4993f464831e0c36217a17ac62cf5a11b11d0bdd3217660ac9":{"type":"demo","days":3},"c4efbb308a3c6f383770c5e5abfb94c3d72e9f784301bf4d7e7855e391d35ded":{"type":"demo","days":3},"8152254cabd57677d1c4cbac79eaec92133afec7014cb346b08a83d3f3ced6ad":{"type":"demo","days":3},"87366057979574a077c053a1106e715c1b0685b6a719597d8e7f2f825a1d8e44":{"type":"demo","days":3},"858f8ed7f981f7dc542f673345a2dfdd0e1c6e8b135045fd8c2133118b9516a0":{"type":"demo","days":3},"9ed9f7726436d382de251f18373e34706c6829607afce356ff1aa6ba6e899297":{"type":"demo","days":3},"ca5cf9e0b72187171f80eaeef468502552055af2831c0afddf3bbe9433f5f71b":{"type":"demo","days":3},"139bd1b8136b9daa6d12a355d60558e6d695143aeb5b57fb39fcb5b9c3e5f236":{"type":"demo","days":3},"45e0f33d401ebefdd8aa250c589d6a789c961b15b2e75d72306322ec9d92cfbf":{"type":"demo","days":3},"b0e16987964d84bb5feca6be6e0fa0ecfef43f0be12864c32c1b21bad671ce18":{"type":"demo","days":3},"62e15b856f3c18c979d48729d497b198f57b255f5757e0bca0141f91a7878feb":{"type":"demo","days":3},"31e93dfb005fa2041f95a9ccbd9dcbc373296976250efcd16321c065c84f88da":{"type":"demo","days":3},"a27c2a30decf7095dc422da6ecee48769f9a8b7111ff0365539ee23d11c9d198":{"type":"demo","days":3},"5466d6a9af8b4bbbc96321bee6b27b805b3bc916f470c941dde653dec4327e8f":{"type":"demo","days":3},"85ceed2da23f24c1cb837fee33a399325e9c0c00b279635468f5dad772e21854":{"type":"demo","days":3},"44a2c94ca29dff0a0b1c06236525ab355b383d5940b02627c432cdc0faf5f304":{"type":"demo","days":3},"23506a1182b623ab8336b784ae70891605abb2df2deb42cee3d5c19a21f85836":{"type":"demo","days":3},"c5fb3f400472dc102f642409bf8d5b3beac7d0398d922d760cf9ebd3be474acd":{"type":"demo","days":3},"b560e4e183429cbce4bf40f9a00640a9d485417d40ca4f8f112275bb291d1f11":{"type":"demo","days":3},"b2be22f67dbe863e9dfd1f6df628a4e2a986b8b199b72d28b9c5437975531693":{"type":"demo","days":3},"eeadcc8c41e57e10a6570bab8687c48a6cb5836df5ce90f84e6bad62a0b4a7db":{"type":"demo","days":3},"a75d7d807efa3c3eaad67b437bbdfb285f011f7cc203ed6e702fa8784dbe085c":{"type":"demo","days":3},"3ea2158db3bccca1fcaaad95b7ba1758c71338b3bbe974eec2127f3428fb0c16":{"type":"demo","days":3},"8094c863f561671522ad6fb33da65106c4506e8122f07cc0291014bb5791e1d6":{"type":"demo","days":3},"3f2a19a583e894a9e327a08853572b90499a30f7939c3619fe32e6098bf86e65":{"type":"demo","days":3},"6c42b0497b61dc3f6ca3def4492233a6784d7980e036c18887651cadaff3a734":{"type":"demo","days":3},"987eec435f60b560ac63d70220c61b65bbb3eb1a66526fd2b2f3c7ac0007a9d6":{"type":"demo","days":3},"054c29ce04bb473d8891fcecc4c5e6064ea630bee306565b5ae0d261e5db4a49":{"type":"demo","days":3},"6254d9c2bce31441813b4a67d77c7d7b7c03471c0e209c2af37732c75e16507d":{"type":"demo","days":3},"6be5ca3eef842a5fde9fe7e9ef3cdfdf8d419b08a7f3ab9ef97b89a2d2c9c109":{"type":"demo","days":3},"b8c4dd4bf7deee0ba9c079f2b6cdca6a36da64222f2b19e84bbf45472c5ee7b9":{"type":"demo","days":3},"3fe3f7a93d8e79f142b57c36803c0d96e7db1f6c5e61a7a48dfa9a2b4a2528d4":{"type":"demo","days":3},"e9c42493d11c55db1e7826ee7bd7d4efc561e26e8c870da5ac088b05eccb0760":{"type":"demo","days":3},"2f44ba96b733869a42da80f595b8a41f0c71909f55042036a5fc60738996e87c":{"type":"demo","days":3},"dc12a41531d1f05e10202ba7737a050c443cf8033eacf2dd6a55471426880328":{"type":"demo","days":3},"e34444ec400aba974a55d043c0388cca84633b95b6be635689f373805a55007a":{"type":"demo","days":3},"ccb2f282efa2b37f4a6c88a1aab24fbbc4b78c434561b16b640980d79ac8f169":{"type":"demo","days":3},"23c5856ccc1babc33e113f07d5d9090e82819f9a5485a6abbc841329b5d9a50a":{"type":"demo","days":3},"b710ad94d63300d6fc951dfc7bba867ff7bcbe1965edb978429516b3cdccb63b":{"type":"demo","days":3},"efbac5526ae4ae80c04b0f2df6bb275867f87c71873bcb4043091ecfefb35cd1":{"type":"demo","days":3},"3f7d769f0cff95a0c2f054f072cc1029afefb5bd2c8016a0012c3764b6095bc0":{"type":"demo","days":3},"408bbc4529546653f0c5e9bc71af4c6e1a94cc67dd595d56b4b483a1a793cd83":{"type":"demo","days":3},"df66c65054e39f302c75fc5ae936e023674f3e03eb5f6138fb6103936ad99c27":{"type":"demo","days":3},"366e178a3d002eb1195cab0aad5a3ac035b6131c967b8c8513188074bf3a7aff":{"type":"demo","days":3},"5a1bce6555b14b8e6e11d55aea303e8a99a2b236317dade5a5fab469e9851848":{"type":"demo","days":3},"c4be92be81d2c47c1845e1f3b7b2c10eff90fec5d7a9a54ca2ed8f6354cc189e":{"type":"demo","days":3},"9e7bae628f1cd85d4d66a96c74cd89e46f2bd5f7f717a57535667692fc5efa79":{"type":"demo","days":3},"32a39d4512f15aac6a8e30b61f95118b8ceccf69117e205a207d09aae74d113b":{"type":"demo","days":3},"eb9c9917d706f757084c41262ce0e2a76a116e5b132c0beddc119d518f718514":{"type":"demo","days":3},"4e46135c55e59b7fa73a19a410448e55fd27325c010b02b8d59aa82f5f2a3eb9":{"type":"demo","days":3},"0556bdbc343784ffa8d4be9e8206c27c55aa64b6a4d2c3c04af1b6c67ac64bae":{"type":"demo","days":3},"1fc0eb4d92368231444979547570ec519b256150697344152a99ebbcceb1bd9c":{"type":"demo","days":3},"3d4efd6996858d81f15e1ec97b8b27b11080ca94227782f67aedb3e3285aa096":{"type":"demo","days":3},"f173eb344cb173617933ef70bf5a02b44299e07e625e8510fad4b1cb4986c9af":{"type":"demo","days":3},"fe07c02ac435efbc7adeeefae2b9ddda0112d15f0de75b4a892d10c8ca0a648f":{"type":"demo","days":3},"9ed42a73bec45fa009b22b9fe9445fa35a50d4a8ecb034f52afe8b90a03677b9":{"type":"demo","days":3},"a66ccf83afbe28c07bd500c93c589ac9f145870e43d9c1dedc71aaa2db3dd3fa":{"type":"demo","days":3},"33d1f5ac911d497fcfa595a6af692036291476e3160343851be8e13ce63bb122":{"type":"demo","days":3},"fffa384b9dc66c3f083bd4313b44b0ef3a5557b73cad4776b68e5ce40caa1cd9":{"type":"demo","days":3},"de46e1d7c17b536d966bf036c24ba46d48443c2534e5a2b3b70d47a5ff8b4943":{"type":"demo","days":3},"61df3e8f4ad2a0ed5a6be44b018d3732d8a063d10f651d054070f966381cf9c9":{"type":"demo","days":3},"b8c3f4645a6b20acfa79d8597dd81d518993de714bf05a2093d143aeedabefb6":{"type":"demo","days":3},"61e6cfc792e5284e338ffc8addff5cf0234772597138ccbea0fd9b5a8260373f":{"type":"demo","days":3},"92b6ab9649468fddbd557c4b03b776792c8ae703dda8363361b022a8d4735850":{"type":"demo","days":3},"2eec67b46bbe391beb71ff7efe3479f37637be98fbfa7e2e98b9d9d398926af3":{"type":"demo","days":3},"84cc7e0e4bc23e0d8ee4fb8b4f35163a3c6849a1f8171ab4ff8d145784e7ca3e":{"type":"demo","days":3},"37f07e51088047e7ba236573c6f2a64e18e9988c318dcd822c7115f78d50ed3d":{"type":"demo","days":3},"4f77a0286b805d61f55dea2462904570c7801722a14454a41363065d92ea18ef":{"type":"demo","days":3},"8da67f243c511fb7b0b2f68aa30b08dd2fcc4b127f07507875fff8bd6a1dd2f7":{"type":"demo","days":3},"a66bba1125d3480bef3c4188cf67ecb3850a4ccd64613e80114e98aa23095a60":{"type":"demo","days":3},"23e83daad3427bdba567886b65d3f89ea5ed42377be5da898a4a3a2923784215":{"type":"demo","days":3},"7751b0703ddb84ce379ef8f77823fa63f1abc691bc41e006e2b1a4365cea61c0":{"type":"demo","days":3},"2dc2646bcca6611dbbf686c040a0d1c790f99d05334178bf457934a6a9179c1a":{"type":"demo","days":3},"4e4d5a4dd33fb7ede8d98069b40acaaf3788ed9fcb3634f88f3a00e5973177b0":{"type":"demo","days":3},"018b00b76ce7797cadaafbf7bad639d86f9ca93a53c1108e811a410432630354":{"type":"demo","days":3},"b72957165c3128ffea171f66f0e42b8ffc702cce0e3c0f947d757335d86dc99e":{"type":"demo","days":3},"9485d243633523c28881fe6b6f2a844d644580f4ba02251178276e45b80dcbac":{"type":"demo","days":3},"61810efa355b12075f95e7cd8e192fee7a01ced3e4b99c3896cfd4420db82ed8":{"type":"demo","days":3},"c229d6162677cf04acbb927849ca05782d346ced20b0dac06de2b10c2734e9db":{"type":"demo","days":3},"06f31660b015ceeb0fa71053e499eeb296cfb5e360a3d15db518d05414bc7fa2":{"type":"demo","days":3},"68ea510f43537b5771957c11c0a6c3c3ce0c670f223330ac6aaa9146c697c010":{"type":"demo","days":3},"cd9740c57b449f0cfc155464129b0ea218092ca46085e2848b71d36ad493dd92":{"type":"demo","days":3},"20faa158177ddac004b666c730c7c5e2c90ca378cbb52ed2dcaa0c5fcee27e0d":{"type":"demo","days":3},"3240847e2cae59f745ce7183b87aba44839a3d91266bf798bfba05420f0c1db9":{"type":"demo","days":3},"c0c4aa8d87b4503e0711c47e4fad82109754fc6b6534f0fe8b4e333fd6207057":{"type":"demo","days":3},"619265e68990e1e077d9262f6c49b53a931d969ab83887f9060667b342dde5eb":{"type":"demo","days":3},"78004638319089e9fbd9faaf7f9f507d07f1b05f63eb15d6b7ea30e899a6997b":{"type":"demo","days":3},"f558ec723e658ebe671995f2e2e756e662496d38220c4b6a1479ebd11cdf126f":{"type":"demo","days":3},"757c8e690faedbefabbfda1396fd4acd64003dd29ce9cb81112bcedb96ecaf47":{"type":"demo","days":3},"d2fe734d0bef7302192ad6e7c35a0b219de80c03a667b96d333ae7f82dff95b6":{"type":"demo","days":3},"3fd88c4b3a3441ab212c1308273d6c60aa207688274b6eb9cb0b08b5a24b9763":{"type":"demo","days":3},"42c952d3348c80151735022aba956972bdf1ef47e38bdf92dcddeedbb59b4934":{"type":"demo","days":3},"0f59602b112a17f310e523f8a060af194ac6aca22f4aa880c741e50e82f973e1":{"type":"demo","days":3},"a5aa94ae49e53ce1384a95bd874d69963525551833c38706efb1b6c13993eced":{"type":"demo","days":3},"b3c98deb27fcc5500669a0b5f5e9893a704f86d4905a6b457249ccacaaeea82d":{"type":"demo","days":3},"d2eeeeda20468c8672ec1dda9f5ae8134b60b04bf38aa39075c0f53439b716ad":{"type":"demo","days":3},"d94eb88c08f3ca8485d2d2231e15dd8523818541f2dce358257576c96ebf0504":{"type":"demo","days":3},"6bfff6c55c1898da7ab7d721d749c4c10c59645d8a8ea289e3abd30b2a4845dc":{"type":"demo","days":3},"99304e8180bd389f8b64efebe88ef02c8110fdfda2a89a4b8d99e777af88f727":{"type":"demo","days":3},"675156fe84389ef1c82ff98f5a6de72ca0f387a07d15d51ab66cdec9b6f17f3f":{"type":"demo","days":3},"53ed7d5ddcd40d4562147b9cf1baef7ea0a8148175c4d1e975256dd72b999c5b":{"type":"demo","days":3},"b2d9e7718e7e3f70de01236f68e9786642a05e629ddc3ceb5fefcc4ed2cc8600":{"type":"demo","days":3},"f18181b0b5c19a8b81b64aaaf9ec7b4e17361b7abebbdc683ac2449399365aec":{"type":"demo","days":3},"d792735e948631e3a70e1c378038fb8d6dd467f61e6cc2fecbbaa885f4bbf9d9":{"type":"demo","days":3},"6f1431fc476f261111bca8bcb4b107161338d39f4a842312ed6b108b8e0e677f":{"type":"demo","days":3},"70f46f05786b7801a3fcee64f2c60e16f948ad29cc1c6051378e27ecbf1a9d65":{"type":"demo","days":3},"7cdc643ab778510e42f8a72982cd200a00b601d5c8baa2bf67e4dfa033261449":{"type":"demo","days":3},"b07e1ea81b7b4396232ea5beaab89fd22cb679af2970d7106f5a0e671aed7f25":{"type":"demo","days":3},"9d3cd23562863a4b05c51460595e7805412ec2fb8a8b4c1c376d97560bfb25cc":{"type":"demo","days":3},"7eabd290d4e611a118bc69ba0c6cd567102b4d9b029d312b2b92f311976111a4":{"type":"demo","days":3},"904f3101944eeefdc03feb3f18da6a937a6cc13625ccb2bc8b590d489dcf7009":{"type":"demo","days":3},"0508afd36166bd0cfe0bf202db095dc04409bdb7d88f28dded69026d8dda4024":{"type":"demo","days":3},"13415bda38a6033a288862196315f3a48100a1bf57f96280887e279fb2ccc8c5":{"type":"demo","days":3},"b6f2592039db207c03963f3b568d376e896a24baabed65b3aea08d9c153b03c3":{"type":"demo","days":3},"934abb56578edfeb70af67c84b7db09ecd192b83a4bc302b80c51782fadac189":{"type":"demo","days":3},"9348eb3774dbc084fa90af3593d3128d99f31363c66bcdd8c1207f8ef0de4a1b":{"type":"demo","days":3},"f3518c2534403154a56751153ab53fe5ecd69f723e7ed47d5be095298cd37adc":{"type":"demo","days":3},"5a8e7be40f000218218a98ef048dd39e5493a11c2820e9718914574617c869a9":{"type":"demo","days":3},"6746564e2e2402c43fe8adc786332ea6fdac83413bb646890f7c421e144fa3a0":{"type":"demo","days":3},"e49664ae8bc4a64122abc88cecb0996ebcc5c352eae7372f13cffb25da5593cb":{"type":"demo","days":3},"0088acea19f708df741088fdd4190afa73f7576acb075c02a3a6408efef8a890":{"type":"demo","days":3},"6924d4dba335e08fa6c2a951d0a4604e1374d52788f36896a3e19ba07ed77c6b":{"type":"demo","days":3},"10aafcc4760d8156a3722e59f0b1c35452cf0f9af1769ffb7d0225cbe2e0d6f1":{"type":"demo","days":3},"4bed23cd1accce273d365dd887484f4eeac4a54ad1d7321c50f640ccc2913d43":{"type":"demo","days":3},"ac7c7868b618983bd740249393d820dab35a7b75b18befb1810580d2d6f637ed":{"type":"demo","days":3},"a688e1366b92a3f8685b54937e774f1287d03ed1a6b653fa42bed0540d307472":{"type":"demo","days":3},"d044bd5603616bb3b9d00127050992681580b61f9b0d0f7a424cccd1c79a04fc":{"type":"demo","days":3},"0f5c5ae655563c389be424eb99b7adc90d0d7af84d4dc5b4c79ce973dbab3e3c":{"type":"demo","days":3},"1adb64bdcf0446bafbae6e568b95e929ee5bd939a2ef9e5cf0a231149ca97a30":{"type":"demo","days":3},"b11723f85dd7aab729a81fea9fed477650dde65730dddfb6fcc1e04968dd629f":{"type":"demo","days":3},"8069ad5d392fa64dfbc90ae43d0a13128aac111f644c11d3807e0a910f628609":{"type":"demo","days":3},"bb543b988dae109dbd69881ed065d2a4a0acfb157fbab6a91568a9f143941aa0":{"type":"demo","days":3},"4ccb6a314580d1c582ff720c4037bffbeda1088a317a8c1b8c9e60879775237d":{"type":"demo","days":3},"2776083db1d4ad301ab9bc3ae1361cf39125162fac7fd97ad02b39ba385c4ba5":{"type":"demo","days":3},"815ca1240c830683c0259c89adc1daf8159496042b157223feda21fa68927dc2":{"type":"demo","days":3},"461c0232939eeed13a4462af64dfbb5d7576d9021fd2078db136699da5038b0c":{"type":"demo","days":3},"85ba88de4a182a4c86e912edef4c945ff3188401397f34610ff1f9832549dd72":{"type":"demo","days":3},"c0861cd8905a6454a21c092a2c7b89e951bfb942de12cb642fe7a31ab5a7c51d":{"type":"demo","days":3},"db70efb58c8e8acec4545b4454cf18f6911fad0e0d643928d15ac92137bd35b8":{"type":"demo","days":3},"1e989541b35c7bff0d82ab15e64d082342bb3d74ce1fe508cc88c85d2f149b38":{"type":"demo","days":3},"912db1cc6a3fcfac041e418d9a9a5c3350357387a9f7b50ae2df658dfc820164":{"type":"demo","days":3},"99237b609643c7fed5c25b4cb4ac8c9aca1b547c5171962e270f123357e96b37":{"type":"demo","days":3},"f0323de655b1a769021bd8e43978413be4fc9ebc660132a0b79b6acbab649538":{"type":"demo","days":3},"146bd644978478dbca6e78d1bf369459eba2d050af820dcb34593211f610c194":{"type":"demo","days":3},"e2e2710a62a2a528efcc85455f6c093f278d66e412dda625397a013d95426301":{"type":"demo","days":3},"0475f39aeae5eaeb89b5a196da8c335bb8715c8e001a38769288faf1d858d85a":{"type":"demo","days":3},"12a5e2c7e402ad6bf735ee9028f8532593abaf6b1c9c843eb8be9438a0c7a47b":{"type":"demo","days":3},"7365156cb3ed29ad877948dbbf753d71e5dc60d0042e23dbdc78fb722c47ba35":{"type":"demo","days":3},"7ea05a94655f4f5f6723613039c45e429b2967808512b86e14416b8ad78cb113":{"type":"demo","days":3},"3c5ced37f5e6e5561bc1e4595a9e7a84c5a2105fd62a5f7e2c23ce6a0331a4a9":{"type":"demo","days":3},"944a961a9d77fd00964a63594f3d9f25e169a749bb52f0abf1f0a7289539dee7":{"type":"demo","days":3},"d9714553ced157a10366ad5da27733d8428b8f5be6f9f434a0306b43b1a9b778":{"type":"demo","days":3},"f6f7c22002dad86abb13c4e9ec0f399a172e3009243a8084ba68c08e4f1937c1":{"type":"demo","days":3},"23af9c3fad4e9e9c3d3531fd5d6374dd7fd99a9ba7d21c9be337a13e08c773a1":{"type":"demo","days":3},"aa3844225412d2c56844e41f68aff2d2f72ad5711ba2cfcf3c658e4246bee1f5":{"type":"demo","days":3},"f75a847b118aaa42139c74dda68e4a386eb870691dd9288857b66d41d8b3d79f":{"type":"demo","days":3},"4a4bfe303cc1cb51245385fcd1bb20cd12f00f6785e4c779679c3f21734b77f0":{"type":"demo","days":3},"79a51beb89396164e12dacb66e6c1569537d55686919b8e2521b97c494a9a23f":{"type":"demo","days":3},"9d4667dfb18fd780be811a57c5b1fc6b4ee3e2d030bd8da63a12400a5e96e284":{"type":"demo","days":3},"1f3664ed04e1eedf9a5454c251658a66b380e86e0dbc18b44fdce6721a626960":{"type":"demo","days":3},"db9e3062d3a424d0d47dd5b8d5df294166278592681b7aa01a7ca0d6d89d782e":{"type":"demo","days":3},"f71ac4b4080f1adca4f020f5855c690e67155adff89f4cda0f53b83f093f265d":{"type":"demo","days":3},"83815ec39fb04566133c1a1af54c0097e456c696672f8f1f285e233c320c0f0e":{"type":"demo","days":3},"bc8e5fb00f57e375bf99f036d271095399e844b6b906c10a58d1cfac87980eb7":{"type":"demo","days":3},"4f4940a39fbd2294c2fa342e9843d1543d268255d6866e406bdc61f218c3faaa":{"type":"demo","days":3},"1a998f73e4f3c6e804159d8666ef611c821eade72c59cb6b34a04b7ecc7aa6d3":{"type":"demo","days":3},"48b6a9db4e074cb6e7a149417fb36db4749d3d0d6e13dc61350ae9f3d646f6a6":{"type":"demo","days":3},"c89e54ac6585319241ee134956ab9caee8a1cd045d6b5260d9ff2e9b42064dcc":{"type":"demo","days":3},"855acf09ab17276611d408886e0c456bf32daf5818bdadf27f20a6763e77dd2a":{"type":"demo","days":3},"595b7355221c5c57dd50754a6fcaa42d036e7d8975b6b11da3660179942c9b68":{"type":"demo","days":3},"33966c82e488ce56d498f89da3e7df4552be055b0fb9a1b11fe846af747eeef7":{"type":"demo","days":3},"cf1f23231cfc8b3ff7d41036475546ce70b389333f344508fa1330f696b4ff68":{"type":"demo","days":3},"3cc65fc013928263a4985675defb02c398255fabd4199de389ec152136399673":{"type":"demo","days":3},"12c8e6a7fb7ebfd9327c419cd3d970e49f9f460400c0758f4f2bc74806e510b3":{"type":"demo","days":3},"d9755d213f7ccdb856730ee139b1e352b71736a76673bd67f2086f1d6c29051f":{"type":"demo","days":3},"3f47d57fd086347d2ecd4f050795c7ef7b9bf752790bb1c72bab55ad03c0042e":{"type":"demo","days":3},"35e834d35ba72816a0b0b73885943fef7d69e8fde8329fa05af451c4b43015a3":{"type":"demo","days":3},"356089a9fe4bb582ddc2eb2cc4c979432769bc4fa5c81d6198a4c78d3a62b4df":{"type":"demo","days":3},"4bd70472ca3f0a311f95f06ffd37f5a337093f8435b7dd5515cd5d0649cbdd24":{"type":"demo","days":3},"85d28317a74171ddaa5a7b6c9947626d0f72043bc1c28c3d180d827622e3008e":{"type":"demo","days":3},"2f766bfb5389136e8c92d11d05b45dc4fd04eb2cc8845d6c75dd1e8e830835d2":{"type":"demo","days":3},"d0bf91b11b189c098ac71c76a08cc477bc950a8a4ec5dd8de3170677b71ce771":{"type":"demo","days":3},"f15f177374cdf85d51efeb2cb8c09cb1d709ca6023fb6a46c538065991191fa9":{"type":"demo","days":3},"086f962403c5e33c41249eac140351ce32214ebfec8eafaf917c58616ba2909d":{"type":"demo","days":3},"8b6ba7c49e0fd8e5c132fb034b1545827a1f089db442d1d80302706602ed9ad1":{"type":"demo","days":3},"cf9e095ce0a63168e852140e3dcf8ada91c97fafdecdffa84429a4dad3998201":{"type":"demo","days":3},"bacbd03d88871335014fbe33a7ffa801997df74045665c330f0df5abc6a6c252":{"type":"demo","days":3},"28f046242959b5bb1547c80c2573206b1245d713f6847da8660d0693d3dd99b9":{"type":"demo","days":3},"fbd12df2eeaf6269e3037624c33f044458d4a2dfaa856ba6802ccc2e44e455e1":{"type":"demo","days":3},"23238a8b8872ae01971190d77150c3f800e2b2ba1a385c26c6af05d8a8955694":{"type":"demo","days":3},"aa297363b3803306ccd4be59f5ad1cd715efc1100155606f9cbd94b16d0702d6":{"type":"demo","days":3},"296147e8ddc264b3ef4f28fc24ca970e6124b13c7d5a69f3153dc313f210d2d9":{"type":"demo","days":3},"039378e7641cc3dd9bc355f454231fce562b031a096de20436181fad51254c02":{"type":"demo","days":3},"7d0f82a6b34f607693ce9138b2bb070954e6cca96595aae723f33655fdd90420":{"type":"demo","days":3},"1f1f0ceb3c603703b30552372a2f4c36984fd754f056cc4a11485a6a8d64ccb4":{"type":"demo","days":3},"049b7b85e0678263cff3e46a041161301682088474fffe87f618ed74d9ca075c":{"type":"demo","days":3},"8dd9cc201beb5153a856e9702919a5dd5b9bac90c8b1a2cd562b8fd8a8d3d09d":{"type":"demo","days":3},"a697521f5c524ad76c34165e3bd2a6509dc074c7f9672b2aab9d983088b1d1c7":{"type":"demo","days":3},"1e5c06fa34b2ee8e348be032d48d1af4ecfe10308a674ece80cfc86e1d7a7752":{"type":"demo","days":3},"7659e0f39cf1b6abf3806bfe26b707eb67a647634511ccc7b5a7932b3251c7b8":{"type":"demo","days":3},"42befb5f2b932d102b106f37f3f7b7a0cb44b17058108635d38e205a202b1610":{"type":"demo","days":3},"811d150fafd644dda205d08490b77831f4d422c6300696df4c095cf9be99f91a":{"type":"demo","days":3},"586efdbfeffe5511ae8804740a55990a79bfc2e696b987727b9947496e260dea":{"type":"demo","days":3},"8f63fcbd21362073334bb9cb15029d1018c886bd07f5148fbcc1e3fb594c1f3d":{"type":"demo","days":3},"7728d6f10ba6fa95737a346991bdb0728a57bfa28ed3b9f5125586f44d9dd81d":{"type":"demo","days":3},"1d90408e63caa433a5f3bc7f20822d4042a83ebaf73e977d6aea9e32f1d31405":{"type":"demo","days":3},"cd0b43eb78c7bc160ce340a9a38b823fc7fc5d7502c0a19a2837a2ee8b047e33":{"type":"demo","days":3},"62db9ab53984b4519a5ee3b74de5fbe55a1730424553f1ae81080c8f1a24d1e0":{"type":"demo","days":3},"1f7b47c78497ebc653b39e103201c20e5350d75c393caa2b2b3cee6221c1a72a":{"type":"demo","days":3},"d63f78c1cb92de449335aac9a93684e3f0d7bee2863f06baf0c0bf71972fd9b8":{"type":"demo","days":3},"74b8141881c82a1defd4682546ea0094ae7747bcca9625677b73030d861ef6d8":{"type":"demo","days":3},"86b259f87d6c9bc3904fae4e35416afb9dafc005aefb851813b7216031adec8e":{"type":"demo","days":3},"b1c50d9999e33810b0d3e6138d522a485fbc0fe7bd4053bcb488647435a1fcb7":{"type":"demo","days":3},"46a6a7ca656339bd7eed40f23be87fca022d22fe6163340f98ee0c5d8f51d5cc":{"type":"demo","days":3},"38712beb5dff9583e9ed7bfcfbeca87339f4f4821d6e561cace18d77098bba82":{"type":"demo","days":3},"bdf5800dde6a83c9d185aa678a4356285822012f03480078ffc4526a83aad902":{"type":"demo","days":3},"8df542b27e543529cb701c12ac46449ed1053deff9e466ebf6de7e2140dd4c9a":{"type":"demo","days":3},"cedb87f3914b7d9732df65c318381e83813c010f1df6c3470424ee5c166acffa":{"type":"demo","days":3},"b22bd0ac53a50979f975a627b10c47189556d01e2b22504bcaa3f2e6f03b4231":{"type":"demo","days":3},"cc4c97670b6b8a2a6a3ab24bb233e461edcdf0f205b6d676978571656974c7cf":{"type":"demo","days":3},"bf6fc665ca881d480537c130c159d124ce4a5ccc68805a515b7a315413208317":{"type":"demo","days":3},"63edd85b93b81662fab89ac9098584d05cd4177569bb647d6281ff70fc384316":{"type":"demo","days":3},"9e1067119b9bf47dc90bd018eaeff30732d588af16ea9d13d8c56cc97859b892":{"type":"demo","days":3},"0377dc4f3c3fbc9de033575dedde89996304aaf656758e4de7d55d67ac0cccdd":{"type":"demo","days":3},"07569600ce8f2420a52906c6efeb1e523e45101ba4d84274553290406d533f2e":{"type":"demo","days":3},"07e8b1836c690a516d768599f277c390269e981ae19a10fe1ad67f2b96fa0fd2":{"type":"demo","days":3},"54453a7002b0d21f14a855353bd3d603c07ab37d5e81e786ede92b6afe150e4c":{"type":"demo","days":3},"ecb9a42ab2d8a4d27850415216dfddbb92286864d00dc622d9253cd315367673":{"type":"demo","days":3},"6184c7325187978fe9f1ae3fb4a9fa87eef53b8aef2f3a2fb83f10347e6848d7":{"type":"demo","days":3},"9687ed6fa5c9bedc6f7e86050a19f1625a74da9fc7acca2015622dfafa0cd769":{"type":"demo","days":3},"ec91fc031b4ff07f8e88895aee3b7d7ab877f47601fa79223d5bca21ecb0d694":{"type":"demo","days":3},"af0784d8673b77d911d621f22a81a57693cf4b875f8536f36080e05196e73090":{"type":"demo","days":3},"5657b32b4f3052c2010a7f06ae5697dd1a56bc7001d77c8038a96a3e08839b1d":{"type":"demo","days":3},"5450d15e7efc09db92517e04b884b51ca44c3e7ec012329252c2fdf5900e21bb":{"type":"demo","days":3},"2786302f0091afb9795ca4e0b18bfb5d5a4bc41879ee9e790c10f704fac82746":{"type":"demo","days":3},"36d28d7a9ef8b108a6f16116deaf8d3fb1b061c39a60e29b57d6662a4708fb7c":{"type":"demo","days":3},"d5492e5009f9f2b20ce3efa765c9bcedb462bbaf0ad4c66f717075d9c93090cb":{"type":"demo","days":3},"1b321ccd4acfea8f63668898ed033f80d78ba8dc7d6c6f0f4be63c9f0489e43b":{"type":"demo","days":3},"0a912a4b5dea60383d00ad0d867bf7b651d79bc83282541991055bcd8832576b":{"type":"demo","days":3},"5051f12c57086d1623b3184c2204e8b26721d2fb49b56796610f56adbf92eb65":{"type":"demo","days":3},"a496d43a4965cad9cd343ce4582f92bdc5e847f7cf8149463c50d06fb0eb59bc":{"type":"demo","days":3},"f1ac0c54ebf698057aea61685847c3d02c05145d99f61cc07860e6cbb07eb5c5":{"type":"demo","days":3},"d7f5744a29683a97e9bdd6c70c9110aaee253b310686a8dfa1173a56a3a2f227":{"type":"demo","days":3},"fdbc61a2302722f9def467f5fb5b7807f1e5b2a7d095ca8e23868890cfb6ff6c":{"type":"demo","days":3},"06232f995aba4f114c84de1dae024aed88ee66593c6adb87a83c5f299b197dec":{"type":"demo","days":3},"69dda44016255c5fab9e94369cad415f7bbda208de8a1d0cb12265e9835132d9":{"type":"demo","days":3},"6b21d3ab0593741850a1bebb192b1cfca48f0e494bfdc8453bedb18c510447d3":{"type":"demo","days":3},"4171563e8b65dc46c65e0353844a10695cc4ca01be6c181f4d7333d9fa7fa668":{"type":"demo","days":3},"d88982fc8ae2e540b67e9c26fcfa58b0e3f99a920c7b6f4ed3556401ddfb225d":{"type":"demo","days":3},"bb36649d3b56b8c6ed9ada7f94d15b298bebbccee69ddfb983cb1bca3bc93c32":{"type":"demo","days":3},"4f86e06f8ca1761709e606b19157daa37df5aa1b7a8690d420cdb8293d96e752":{"type":"demo","days":3},"2b00d327f00d8545715942abc3fd79d13373466d73b45689eefa6d4389b9c248":{"type":"demo","days":3},"20290035e6d3ba386c1dcf15319110a95de8e622544adf9f76a387f4f906a75c":{"type":"demo","days":3},"26c5a053f2f6a250f73431c11220db2a7342fc0716d2e0a0d61c81580b8d236f":{"type":"demo","days":3},"e7530c820cda847fa3d6dfdd3fd187d73545982a9b1ef2cec0052c53c43ca8a5":{"type":"demo","days":3},"6ec17c88d41a0669a3ccf0bb21da44981c2c2b397a584aff44daa23e3afca019":{"type":"demo","days":3},"a0c29b64409de2f41ac87c8109afa52cb7f230ff493b23b4e21296460a185c7f":{"type":"demo","days":3},"f99b8cd34608997f675b113a390aa444b9050ded543e91522f0d105eb1d94160":{"type":"demo","days":3},"0826d5a26e5bb97f8495a783365031bd8100e8a368efba05f85c1826f1db0c1d":{"type":"demo","days":3},"d4cd18122f1a06ebdc8ef7f92b573d7fc2feb6ce95583ed92ad8cc589dd6b51f":{"type":"demo","days":3},"7fd07546aad0b67779763f5944ef41056b3ad7df23ebbdb737318aeaf98ad240":{"type":"demo","days":3},"f2074c5c3dfb718cf7ca9d5208bd38a6282ff86678b5076d32b827045576e9f0":{"type":"demo","days":3},"385eed2e9ec3484e072effd293f8ec7ff26e738f81c98cc57151edeaaf900c74":{"type":"demo","days":3},"6c4a93c12bdbf1ee82e190be547418b29576d1467a8fa2be613ba1bdcaf96836":{"type":"demo","days":3},"733896e4d6088ae13b43d7a253d829d4b3c9bb8589b418d98431fa277a0eb57a":{"type":"demo","days":3},"656da4b1bff4532cc6162de1f98271c0af2f0372e1bb402aeebae74dc4d75d18":{"type":"demo","days":3},"4beb1e5214b689ed0bd8e4a9013ba4a9c89a4f1efff01c79bf9e12d58d527cdb":{"type":"demo","days":3},"cb09795c88b6d91187cdfe2bf924056df592e36ec54cbd35771423cbdb60c94c":{"type":"demo","days":3},"078731cc0b8b8c87d1894ff4e6a94c43e72bdc06b3b54af4fe3d1335c65f908c":{"type":"demo","days":3},"cffff83ae1700efbf328197e0ec244a37ae5b38abbef11e3ef3fb263b1a101ea":{"type":"demo","days":3},"80e0e062be38adb702ea5e017690756e31c96b9d538c7c2277b5f68cef25b52a":{"type":"demo","days":3},"d7f286cfe35498400caf92cc5cd8fc374862f494f4e0290b0e12166321028acc":{"type":"demo","days":3},"fec0d80a62235778af67dfcb51e0bdb6b9cf992343d7ee863ce8751bdb4f7130":{"type":"demo","days":3},"53cdb7b5557c7bfaa09041f231fa7abd570743fa9790a90c38434c60c26574d8":{"type":"demo","days":3},"e48188d854dbbd12a4ff06b03d419a77c128c95075d82f160133b32f0d2297d0":{"type":"demo","days":3},"aa0f03f0374a0c27de58cc7181e6e4cda943ac272a38153b2a3ded4a33363e86":{"type":"demo","days":3},"c11300bd79d6e8edeb2571ad717ead5d1030608247aa793444b07a0cd839c0a1":{"type":"demo","days":3},"2a921aa86f42d07ad1fb591d9b0253e45247f4b030dbb57af26bef48e1229033":{"type":"demo","days":3},"59b9eaf64cd2d397715d50b7487b780216463b2d7727c0dae0dca08eeaf2b88a":{"type":"demo","days":3},"d5d55391bc4472fbee2a396f1d48f4770835ac2f0258c615329ecfcfc9a05207":{"type":"demo","days":3},"162c0dd30bdc3a17524d72c0bf36a9c3b893ce74e313b14c0ae5804bf3268f68":{"type":"demo","days":3},"8c96d610cb48ad62be94b021ab5d95625d0a3f71a15ccaaa732d129664c2915e":{"type":"demo","days":3},"1e5c07c738ca57abba84fe877c68e29ffeccec39bf8405b0eba5f7ea0b676509":{"type":"demo","days":3},"d3b4d689059c5d0456c6d1e5ff156d273bee6ff0c153d7a3c733a1f358e9dcc4":{"type":"demo","days":3},"8e90f13d07dbfea6cd394b313f120b11e0641c6e47c9277f2eedb08df70fb17d":{"type":"demo","days":3},"37f89ea34a52e9fa6f4a8615d4e79e5cff6c1b6459ecadb9a30315c88ac10506":{"type":"demo","days":3},"a18c03c5594dc192cec759f7597a2a4e4f11ac3116f1807c272d548e6c6447a6":{"type":"demo","days":3},"fa24bdca9dfde609e1e699b8eab3737341c93bd3a082cbad9e30e71ef9862d50":{"type":"demo","days":3},"a956af0a44cc9d1b28ef92498b100ffc63c81dcd4a0812a3e8529e881b988913":{"type":"demo","days":3},"9e602e8712b71b6caff15fb509c8873a16d62894aae0a250c12c421deba88379":{"type":"demo","days":3},"6c86b8254bc52f256b8cf4ba22f829311b76b9802350ba947b66fac50c7a8191":{"type":"demo","days":3},"4c2261656de28d9ee86ce35fd0c068000bb21f26d4c0f7c82453c66dddff185d":{"type":"demo","days":3},"dcd28002390f3110fe1082f6f12feb47058bae780f7e1a08199228b8e8c91fa7":{"type":"demo","days":3},"b06b0eb2019e48fc31efb23e1a320be19ea3c5ffe4a5df24e13708bc41b7c249":{"type":"demo","days":3},"3e5edaebf5e933cf3d4e305c0d5590d2a4468e75a0e864f2eec8415da640d26c":{"type":"demo","days":3},"76011bb60ad5e22f61731cca91771251f6b921b240f6bb7c56f023c87e8afd39":{"type":"demo","days":3},"3af265f7ce69be78a61ac630e7742a74b4d6f9eff95e4b0c100a1d5c277fbb78":{"type":"demo","days":3},"860401408debae9040de3e334929ae2a21e6ded38449a677526f5c8ffb58105c":{"type":"demo","days":3},"d3104b9792a08a06b8fa9bc671634f4d31e3c0e0f9702cb0193427a3b39f4cee":{"type":"demo","days":3},"aee459f9c624dc4f9479b0e1657728a3936bc493ab43bedc5ea3469482fc7ca6":{"type":"demo","days":3},"c53b79c78ef8389a91c7971ec757f599425e06bcd4d592e83b4ee54e818e052b":{"type":"demo","days":3},"37548788c2559cc57ae3f0fb547a68c82c1ffa43072b82a630907f0649a6bc5f":{"type":"demo","days":3},"ffef2ad73dc0f998c3550bd6f8058d1d9797c17fbb208b4d854ea7ac5ece4fb3":{"type":"demo","days":3},"aea4137714c7a1e642fb7e5fca0f7c22f720b5adde8e2b62cf6187a3a023d6e9":{"type":"demo","days":3},"30956e4b0a0a3a57b6d6df1a4eda882909ce15fbc5f721903e7111388db0fa3c":{"type":"demo","days":3},"ba1e7525ca2c9618f766693ab944e5d90b6aa0f39c455402f131a2560f1bb3eb":{"type":"demo","days":3},"30b9d863863a806f905decc428e21159a2e23e21977c24a76e98d22d053518f5":{"type":"demo","days":3},"01c79dd98c35bd115e56a8f3068df00c727a9996644a4d3dcf9af06ae2c8ec73":{"type":"demo","days":3},"c074490d68e27af04bbb7dc2aeeb00b676a8a5f2e18bb361c1edba4b06114af0":{"type":"demo","days":3},"c86849be8b7e1a6f25ab361e66923d709af3dd95e52f3492a77357b634301497":{"type":"demo","days":3},"7c3113df213fb9a6e955c4d5d27f5aa2c301835186d494fad1a7c0169803f22b":{"type":"demo","days":3},"9f0d7ffe04b7cf56c49998954eb95143cda27543726acec6fcd13dc691ebd176":{"type":"demo","days":3},"29201adcc2d72d44f5519cc30ec5112c67566a173ba4d5fa2f77dae0e9ff0c3c":{"type":"demo","days":3},"e6537f54490f879dc124149b169bbb7e0100a6925501692dfde5d62364c3875c":{"type":"demo","days":3},"00cacd1bdf1978c66a4f9a210aa6ca0419dc42e6b6580ea69c048c61af4bcdda":{"type":"demo","days":3},"d953eda8dbb7015dd6037334a7510edbcc6266e8f785ed670c4a6fc0e1e47dbf":{"type":"demo","days":3},"52e9fd121b9eef6b8cc124831afcdd768386dcd8c9ea523bfe7cd795da3da9e7":{"type":"demo","days":3},"fd251ec84850b5a71e6a71dedf16f6f1d6bf9fc4ad929f1a0eafe1aa44d5aa0b":{"type":"demo","days":3},"9a0dae91e697267929431cbc916f25eabc1cb30b2b06b6c6590fa25a1ee41516":{"type":"demo","days":3},"d8b30548054dcba955e8438d608a764f95dd68ad8656158e8a3d2728c8e9a32f":{"type":"demo","days":3},"e45a5c8fadc2b6c0daebde57d382867e29d1aa20a141b7d0854caf881ce3863d":{"type":"demo","days":3},"4a3a35634b93ba0f0c0c98b0fab4b2cb0a777d8eec4a71f857fa1b833e997144":{"type":"demo","days":3},"50fbf5b7ac5b88562a62e4181f3b7be20ca4fec2cbdf79e9cf7eda990a85c6da":{"type":"demo","days":3},"54b969ac7d2698999d825e84bee58e3eca412eb33c1741d2d2a12b1b491db622":{"type":"demo","days":3},"013a165355dfe4cd4509d6fc30ad11168d189f40bef029d50c070404c1da4816":{"type":"demo","days":3},"7c39e3382028cf80e66636e228aa23ec9be0c9122ca736cf2f5e9d7860c83174":{"type":"demo","days":3},"94ec9ffd270e76b8db93cc53bfecacb8a336eca441a95211a47787d209d396ab":{"type":"demo","days":3},"ce4edf4081639bd7167bc49c31315c9ebf0adc3490fd31ac95e7b3162241b3e6":{"type":"demo","days":3},"73fb76d1335ae5749d9a8e9641dbba02a40fd1673acd2001ecf1bcf7e6d80457":{"type":"demo","days":3},"0619fe2dc69885ca8b0d17c73d2b149474b930ed883ce12fd7d489c925e4e13a":{"type":"demo","days":3},"dfe57402af0898cb5ce9c7bb21d8c2ab2af733aa786e93aa8bf390fbd55b5feb":{"type":"demo","days":3},"1a523c9abb8519e318b7c73e31673a9ff3125598be995ab2345f0c8e913b091a":{"type":"demo","days":3},"17ae6c44e7229e4653abb06b29ced281f37dcc1da4a448f57c3b8dc43479d7f7":{"type":"demo","days":3},"31c307b00e4f38c7da4b235fdffe4fc8106b67de76cc25191e9692cb7a65d024":{"type":"demo","days":3},"ab73d9c4e13c5f83cc7ffcef18fa05a01fce1d3046bace44809a6a45d9ce2e04":{"type":"demo","days":3},"6fd4386b5e40023b869f4ff2a7139a1a496a1dd633fe7ed4cb72435a57875b62":{"type":"demo","days":3},"be1c8cb1b1ddb2e16eb80a138aea30422b712d7bba320c10e9bea3c2a3e6bfb3":{"type":"demo","days":3},"8f690d874ec6d6cd54e1694d446b7d1a642addd860f4308e0366a81c28c3b832":{"type":"demo","days":3},"7d1afcbdc2a6858b77eb79d902b54a3603ac142505c9169a03b2ff0243a29e75":{"type":"demo","days":3},"2f83bf895ab7666a1eaf1bae6408c4473e3c694f81d62d31f0839689cce19d22":{"type":"demo","days":3},"6c05bec07a8169b1bc397aa0aa4f1e85aa39cef68b6ccd56dde9de455304be05":{"type":"demo","days":3},"88367e13f23b3926be008c85cdce20841d638a9f44327e9cdcb8580413ea256b":{"type":"demo","days":3},"dc597625f7b5d6e68b9ffac483d26ffbc4b01c10ae3ff5de32ecaf774580ec76":{"type":"demo","days":3},"944f47ed65bf06600379f343e3804fad06bcd6243645b7edc0661b0bd47690f9":{"type":"demo","days":3},"c8b21c2cc547ba4311718ff4074c99bf83e0d2dde4f3da5c5e2f9bfdb0b74b8f":{"type":"demo","days":3},"7ef1c4d68b88c7c99130b5f5e77b2921365abe1f5c0c1a7120224705d1b5f65e":{"type":"demo","days":3},"b810ca299fef87bea8d15e78d1bf9e63b428e377bf25a4a38eade98316f87ca8":{"type":"demo","days":3},"471bda55939ccff2755a3df73e18e7c1478b6b8535913999f532fd6bbd041c34":{"type":"demo","days":3},"5d0669d742b979642b8f35fa2910f41a8c73218c77f32a1370720b55f1be97ef":{"type":"demo","days":3},"2faf5d6f837746d4a3cbe89884ceccefdb1aa69ea467c6963f565a75492ba1d1":{"type":"demo","days":3},"3498081eca375a1192b5a14efaec9e0521a49d760c69e76b79afbbd254d38c01":{"type":"demo","days":3},"18022e6eac08db9a12f1befe297e4bdf83c083580d08f8bdfac6906637146b5c":{"type":"demo","days":3},"3fe65d03fc1621f8a57f4204aecfbf64de13f7d8ffb80f53f99e2d31eb57108f":{"type":"demo","days":3},"593a7f6e3fb0c99ee932f09f9c39bf48b6700b718eef56afe8f3ae37f73281ab":{"type":"demo","days":3},"bc3c84dd4157400abcf58fa46e70b6627c061be847cfcce36fbf194f13f64c24":{"type":"demo","days":3},"ba219cda0b51e675a6a5759fd4b847750df4609c9956fbc26828eefc14845c5c":{"type":"demo","days":3},"b763343c29b2a1b935c56ed1106e597f8e011ac1a49926757159998a38b4fa72":{"type":"demo","days":3},"92689f3bca2b9c66510c9e82a524adc9e08db1d08838edb48b4ab60030d8d06e":{"type":"demo","days":3},"8191178949ebedd7bb43cb26c56e14ec1bfac66975a38cdb0e27bfc101d8af5e":{"type":"demo","days":3},"d97b081b2ddba3fadae22a6874f631f28dad3489c52ddf893b3cf2523d7e7ec7":{"type":"demo","days":3},"a7172b63f1cc6365dae9db4b9c243a43c27afcd3b5bd88b2d07a0fc4e6d0b917":{"type":"demo","days":3},"2a0d2a1badbefc9da3ac3cfae761ac18c3e156acae48bde8416a9b5ac355c21e":{"type":"demo","days":3},"857deb0a3d543d09375321d30cc1808505661f1a87656c2f360d1043f6e714d3":{"type":"demo","days":3},"076c19a07c397172da0df706423e34afa99b240062cf7c5b8ae0bf7368be41ad":{"type":"demo","days":3},"fa2b6cd8777086888f16a890f5124f11e0f518edbe4d12fedce7796807663866":{"type":"demo","days":3},"d5e960af2af8ba37cc52141803e8b7b0ee80e1f91db215e60a96632f0d9d00b9":{"type":"demo","days":3},"b4af8326916a2a5039457701235d5012112b916ce1f5ef43ab0e2281951cd207":{"type":"demo","days":3},"b63865e2a013b6efc59a5bb15f4c690629f4cd7bf34f5841638ab40608902af9":{"type":"demo","days":3},"d3da23f940b99158666a47303207ec869a711f60f4b4fd7335a0850a5eb1ab85":{"type":"demo","days":3},"c03f513ad411048ec7e746e82f24dd9fc0298fa1f26027948e868ce33692c07c":{"type":"demo","days":3},"e8086149a585a9c44897fc33eee66f0477d5e03be98aeb876faaa0230512ea49":{"type":"demo","days":3},"8445cc98e52583e822d0ff03559555de74b7801525e091d03329ec5cccee01b7":{"type":"demo","days":3},"d8eabd21986a6277003ae29ef6f3468c917b376812a18d52189ab432a5a0a2cf":{"type":"demo","days":3},"2fb16697aca6762e1fe3c1513a5a6d733ecb8dac56f6a98a2b9572bd252d7ac0":{"type":"demo","days":3},"633ce8924d469ee5d57815418774d04d83834c67060fc0172411745dc248848d":{"type":"demo","days":3},"e9b8f4540fdb6de11aeeb5127b9ec896ac3b06897be8569ac7d5fbbf7766ceab":{"type":"demo","days":3},"0b09171730c4915ea37e1ad628d48bad2d3b3ec6c5f2b7331ee6cdca5e6c1619":{"type":"demo","days":3},"4353723ea1222ed35a579e50366c380310355e3e7449bcb91346c1b2c32b92c5":{"type":"demo","days":3},"d1a7694726e21e7f51b09272add1cf332396128df4215422f79b416a6a4476e9":{"type":"demo","days":3},"c94a5c7c1d2c13ee2e20b56cf0cc94201a7e2a3c438a8c2e96605d2baaf2aef7":{"type":"demo","days":3},"8395271e8cccf18101537b8a8a0edb1af4f3bc800ccb47f4ebb6a9bf628a2f65":{"type":"demo","days":3},"fb9f0b55e48143b6354380b76900263c83df2b9aa9045a2e286e0843e01fe3b3":{"type":"demo","days":3},"b852dc035dfc2e7ffd2a98d2e06663919fc7664bab182dc3a281516eee80e00d":{"type":"demo","days":3},"25129b4a8748821c2463c07f7ee5c4b49b6f605adafc9f4e30bf65aa0a6ec5b2":{"type":"demo","days":3},"78d5c80c1b061aec67a3d2850dd651003c3096bab6b76a99abd59ba091ba9337":{"type":"demo","days":3},"b38e54a3f67b3fb017ac3cd6e82bdb7e78e1399be15fa7fed551f25731111f4f":{"type":"demo","days":3},"9d34a91811386249d7ef14fab45358120e7ddbe627417200ca24c99ce5ce9504":{"type":"demo","days":3},"630f0dec82c93d05cd92d89c8e9e72f320ac4a2bcda05a7228b8e13916d44deb":{"type":"demo","days":3},"1874187aaa0b3645e6fabc4df89bf01d40c030f7eeca8c2c7cc830cd8b88959a":{"type":"demo","days":3},"d48641c5029e0ab57dcea2d7ca1030dd724c61b90ea50ccd5d0404236dedc82d":{"type":"demo","days":3},"75b72118df6680adfcab0e9915dbf3a76a317c0515952b70e664f43f64d55815":{"type":"demo","days":3},"cafcfd4bedc40185038bd07ecc0c62ec970fdbf9842298bc1d09cfd820212439":{"type":"demo","days":3},"f4c740292ef96ad85d2b103fd12b89758bbc8395597a282b23b6fda0f226d8df":{"type":"demo","days":3},"d4dba9e2f23df1398a2523949e42d82efac3eef35c3938440284698092363d6d":{"type":"demo","days":3},"bc78216294d96ba654a5b99803e11dd205d58d5c9363c499d72206f3019f8e71":{"type":"demo","days":3},"5183399098da4d20b655f5c50d18b61a570f9dee8b53dcdacfa890a7edde4cf9":{"type":"demo","days":3},"6f64dced7be39493c959544b8ec942566aa594ada31c0945999e4603d2891170":{"type":"demo","days":3},"6a0066a6923fe66ca87751ab9b0cff170eecdb259fef87f0b5ea354cb42147be":{"type":"demo","days":3},"a2d0cccb1f81f943a11b8e904fef5d22c22d3d79aaf7ee8c4a713917ae361866":{"type":"demo","days":3},"c96a33ab35886fe293531484a3dc02d3b9203273740ea19e88b131e32fb0c37a":{"type":"demo","days":3},"b782fabb434200bb643fe23e38f1988510ec55651bc7a7a121e6227bd90de474":{"type":"demo","days":3},"55bd214594b444c04c2c89ac05d3acd0509480b2ebb8587ce49ce3141449efc0":{"type":"demo","days":3},"94e197f4733fb6ab21e725c53ba41baaa6b577db32003627e4773a7b0665d3ca":{"type":"demo","days":3},"6a432da2cd331e1721a9a3becff6fcd8c45a66db9551e7a058cbec28acd88b9c":{"type":"demo","days":3},"51c5783b81aaacc9db6d1ebe019a15c012a29ca4659f731e9d1423886beed79c":{"type":"demo","days":3},"627ba3ea4d41fd1bd0e0d2db2168ca71bd633d5dd5443d3c6a746d1cc9dcc0cd":{"type":"demo","days":3},"33c9cad1ee91ede8b4eb5c593d3cd422fbb22924fab4dd76df98b61f10cbba13":{"type":"demo","days":3},"7fae63cc54ea6932cfaa9280d3bdf6cbbbc6bc36f503a9ad316984db2763d18d":{"type":"demo","days":3},"5b65697dba8b097a35f1c12b63bc2ffbec92771b2ce34c6dd03d670ce019c1c2":{"type":"demo","days":3},"382ad5485be443252823e49b9f8e2a1336ce15f2d0052bba7f250ef1ee71c0e6":{"type":"demo","days":3},"ad14f0cc471e3a688e4590c530940dcda016d8603825d9201b5bf50b27d35132":{"type":"demo","days":3},"41903e3535457d5a53d30e0ceb50d11b529b8751b78ab31b25c5d09588573e3f":{"type":"demo","days":3},"576b80d031a50d36f193f30e45b6e426103675f7105a98e202a9305fbb85b242":{"type":"demo","days":3},"d9a877a8650f2790fa7ba1c46a5892b15be7854b16985e255714d5373b794e1b":{"type":"demo","days":3},"8e78d6bad642fc7a00a3beef167919d506924165a49124db80b578bdb4e54efc":{"type":"demo","days":3},"2b81e8b5ff2c5288f026346e54e43ffeae31479db6c4c8ea9c6b2900b6d7e4c6":{"type":"demo","days":3},"0f6cfddda89114c3529265b87c3c1d0ae32ae30034ad372ccb60feab9adb43fa":{"type":"demo","days":3},"7b440d3185cc79c56d34069925281d2773df2327ecdccf14b7e175cb259e805a":{"type":"demo","days":3},"a1804aede978148549f939d8095b4a713fc5ce2c5d0823a1e2b051491ad5ca3c":{"type":"demo","days":3},"5b4465900f39d6ddbb41436833b5c43f0d03e025053a72ea54e42cde8ce2032e":{"type":"demo","days":3},"cdb3fa3ac456af59b83de3fbe7e942bac8d4a8d68910b809bc2541e642b94a9d":{"type":"demo","days":3},"b8f3f40d9d4a29d0842cdb7208a8ec6cbe644ab94d5a7edc3d1394d30662c892":{"type":"demo","days":3},"87395b4455187446fdd1d7a913d6ac7653587cbc789c052c3a1ca15d037c15ee":{"type":"demo","days":3},"986b8deef5ff0911b55d4b7f0ae94c9abd4cae2c41d39cda176ae08a7e4d57e9":{"type":"demo","days":3},"fab0887c1fad9696d4831e5cfbfb7974f0bc21ce92dad74d7a06161b0fd17bdc":{"type":"demo","days":3},"0e215ed9dbeda9869f8e0006925218307a2aca77611a5afa751082491e67e34f":{"type":"demo","days":3},"b11778d042c077c219ac5fab90a7deedaa6a9ebcea81eb61fd5a34b9f0dde5ec":{"type":"demo","days":3},"4a7480e9f15453bfa2e508c463ef4a156d956a938d31077b315df078f996c9e7":{"type":"demo","days":3},"1f214ab7e36a8e0c02fdd3d3ccee4cf980fd882b8f27dcd93b53410a1bb52160":{"type":"demo","days":3},"37cd0581944564be064b0fde236667c4af80ebee4275b6f75ab79f2616710884":{"type":"demo","days":3},"1449aa8f8708ca96f8db951a01bf69cc3177da07773c592b1f59be55874258e4":{"type":"demo","days":3},"5d8428eb8f6e18188ceaf1c76ebf83a7968eae77d321210edf03ee12d0e50de9":{"type":"demo","days":3},"b61f426f3fa68e197da34a6b3997baab5cf1438530f397b861fecbbadf2fd248":{"type":"demo","days":3},"dff116976ebedf7e11558207a9557351d71309c5fed1039444005d1dfe0cc225":{"type":"demo","days":3},"d0c00231cd7944670920fec76ae58c112ce4c167e7639c21166fce2427a1f6cb":{"type":"demo","days":3},"c5bcdb083919f8a0adca244a173f7c9922074561ccf1e4ea3e0285aa6599e170":{"type":"demo","days":3},"5d4629607756ca4003fa85b6d2f90c1c35ac12f1d0c666d083df39fd744c3e87":{"type":"demo","days":3},"62038474a277aedc4d880a9339cf510abe010588261717cac944e2a3e4e8280f":{"type":"demo","days":3},"26ce59623a912b2c7cc8b945376a32548f3906077e7f16ee3dea7cc295c8966c":{"type":"demo","days":3},"a2f6ce9cee12aa874e5aae93a30036c2f9ef6d0ade3ee96b008c8e95e88f47cd":{"type":"demo","days":3},"2d3542ee70a736911d54b5dbb04798806c836b3adeac241258bb151459340479":{"type":"demo","days":3},"e5968c015f510041dec862096a41160ad7d1746e9ad7ed8504866c033dbae502":{"type":"demo","days":3},"8384a2349e1fd0509075436cd94457b6e3788c3e55da4d6227e14ad603c81ed7":{"type":"demo","days":3},"704d19d1688344478ad01aab653514f057216f3f60827ba54be5a56443ebc412":{"type":"demo","days":3},"7ab41b4d7c046ea18754246fc45d6e10dc6848ea422fbfaaa56f6537bb16a884":{"type":"demo","days":3},"80dc8d14cafaa1fc966fd4625e732e7ee151a479ea4d5bde084eb521a45c8c7a":{"type":"demo","days":3},"7898cba74ca4899a117c97f6672de24af5f37936573e5c6b73d62a361edee4a4":{"type":"demo","days":3},"0fb0e57a1f1b2f161eb3a473b68c1f939cb3c84de091a46a0305f5ee784e027d":{"type":"monthly","days":30},"2d98ea7b3f28e4a11873a31a5a2db0c91af6ee3eeedada6549b17e0d2ed61b92":{"type":"monthly","days":30},"00291b9b265e4da15be0b7c633a2c91a87b1f8a44b0bdf1147c77aa55d095a0e":{"type":"monthly","days":30},"b40dbac0440915cea60d2eec727bb3c1bed8d084a6a9ef22912ff5148d06e3e2":{"type":"monthly","days":30},"cb957d489cc9c30c439825fa31ca1abf61b1f0b19d49ef3ef15899303d9be3aa":{"type":"monthly","days":30},"8fa6acc06852c53717a07fa65cb5ec786b83d7bc692446fc8d7069b78efa06a7":{"type":"monthly","days":30},"bd35b83d2da6811b5dcdaf3bb7c099e8d62fddfac8f72e0950a72ac9a47944b3":{"type":"monthly","days":30},"255e528451a790ef9d0d32d58f2252ef13cde013494afac5f5bf307ee49227b4":{"type":"monthly","days":30},"42b5e54ff6b8cfe943f9eca0b11f24fb1a8e26eabbcb72a6912b7fc639cf4cde":{"type":"monthly","days":30},"ecac31034a7488bcbd4f96f0c9f1f11b44db0f52619e474cf5e2fdeb551ebd6d":{"type":"monthly","days":30},"5ce0281d647ec4a7bd3eb3463df3df6f02ec2919bd8ced0656106477d3bf8ba4":{"type":"monthly","days":30},"1761c45e096e555b2616037c1a7925c2dd3d9b600720941c66919739be190583":{"type":"monthly","days":30},"28e348230a0a9baeb49ee0d71cc7e1335c9dc07b72131a5b8344f712af2e3b01":{"type":"monthly","days":30},"02c038af12b6ec949f5f44ee2e66f47ede7f36705a4e979c13e21ee3c566d852":{"type":"monthly","days":30},"ad2c254d0eae0883bb23e8208397a527beb99559022b8c12b37bd44d8d943f95":{"type":"monthly","days":30},"f413d87c3215f821acd69a63697f65bf1d99d63786c69ea7ae4fd26dd93a9b26":{"type":"monthly","days":30},"d61deae8dddefe25f37c8780331761fe5065db1e70ac71513f3a9aada0f89fdd":{"type":"monthly","days":30},"d0d746b3f7c8ae9961c48bf91d141599a5a566ac57382a97ec14f2b7080ac35b":{"type":"monthly","days":30},"84f2208605765d9fc59fbc8897e137da0d996c7f825c263a6b37bce7c5e95e81":{"type":"monthly","days":30},"1dfdc3550acb3acb9acead59e21c1979b26acaa4b80570db603fddc3b3ab6835":{"type":"monthly","days":30},"7edd0f7fa8dc26e4a000b9136506f52928c97d61e8480018ffce7e0fb85a7237":{"type":"monthly","days":30},"695f47cf2fb0e4ba13c93b053225fa4ca479147f17a5e5242aeef522bd56970e":{"type":"monthly","days":30},"0fc98446b8eb2a3e210e6ab191f9887a98f534d6be3b76b2f3f3999e6cc4f114":{"type":"monthly","days":30},"1c71d6caf02b11db1b7f3650867ed4181f66f7a88064ebc08031978a45f6e7f7":{"type":"monthly","days":30},"fa4f0cbc98d076fec5055ea5d2bf3ac7ef35c1aaa73dbde8fc793bd92d08db3c":{"type":"monthly","days":30},"7f42eacc5c5b6311d1e4512b4bac2717e22206cb125da7db5c5f6e814a89a3ea":{"type":"monthly","days":30},"b99d13c9f9d744a1fcf3bf3ed013cdaccdaea5a7260c471bf6fe6936a93b3700":{"type":"monthly","days":30},"ec3fdce0d098277858d4f7dbf38ba40fbd48eb6680a36fca316387a2e8237efd":{"type":"monthly","days":30},"8d6ca33139a9671f585af0ea3dca94cc4d6ce1ab2267afb4497414f42eaa6fe5":{"type":"monthly","days":30},"58f57711aff2e153ee5103d55a00b50c96fc261d16bb8a5d9a7d94a2462e2e51":{"type":"monthly","days":30},"e53605d0f3bbcd923eb50a76f5607dd2aae2ad8a4b3312b6fc735328e0dcd271":{"type":"monthly","days":30},"0d09c24f33f560c91a472ef3bdd000b836401336af0de2011fd95c667e00717d":{"type":"monthly","days":30},"841ad64141cb4f1e0fa82f389fb6b71b70b7b36b7927729cf9800605d9445b3b":{"type":"monthly","days":30},"00e5b57ee56a8c9656db96598da3c306006c6e90c3a9e2b5114cf7a19df0ef4a":{"type":"monthly","days":30},"6f369eed15498915dc2cbe439a6149455aa72b4138ffad01a78d742ccfcc92b5":{"type":"monthly","days":30},"8570823b4c60e0c18bf40609146e5c63b1ea81869d66d13ea6f481e81f827cee":{"type":"monthly","days":30},"cc8a86946a6d46eea3a98eadff1634a0f65fee6b1df50183d3374b9bdc67b3ec":{"type":"monthly","days":30},"94c4d5081454f5abc3d9b6b8c727a5a01fda91badcbd3ba3270e853c672477f6":{"type":"monthly","days":30},"7e0ce1cf8f2166406e96f170ea5312b8edfcb4621e0cea7e30d4e7eb5ef32d0e":{"type":"monthly","days":30},"cdb86b0031d29837d842acfb4609e9a303625519c269c46635837954e7d93daa":{"type":"monthly","days":30},"7a9fea4c2d5578e5f99673fd7ecbab4dbaf62cf43b614c0b89587377184d635b":{"type":"monthly","days":30},"355ad678988bd4e585ff4c44c79691024cd325f14652bb273576bbd8658995cc":{"type":"monthly","days":30},"2ae224d3bd89cb7fe93ef834f400f5ea97ad100ae50021aa7a3add589fa46382":{"type":"monthly","days":30},"b5b7ab0482bcecb23ff783c86e4b99ca94a08138163f5c3d705d1519de5a73b9":{"type":"monthly","days":30},"53b801e339bae802e4a62aac61f036ec7685f8cb2ad15c5d82757f885bce2b58":{"type":"monthly","days":30},"fa7a3863e0498d5fe2f677ae957083e7fae6ef26ea6b0c1a46745d2a3f823ad4":{"type":"monthly","days":30},"a9497c402a87a3a06264f8bfb76dd1c36b2792919e43ec502b8e4556ba7668a4":{"type":"monthly","days":30},"7a61e752404f016b31c0958be1174d10e35df4fde4c550a329cfdba4b1ffc467":{"type":"monthly","days":30},"e019a2d13c7ebaf349077d60a8c51e325e758bdbb50deb00d42eb7f3e574bb92":{"type":"monthly","days":30},"c2d9fb7b6be6cc621a8e8dc48c914cbffd82b11a01f1c4604d5175bad7ef6591":{"type":"monthly","days":30},"f407ba65dbcb35e7b7d1af3923217fa53f0852f6f058f14515da2b139dcdc246":{"type":"monthly","days":30},"a0aaba7bf1eeb91ab162db1f71b0ac622cd17f30259eb3c6a8d0ee09e7f909d3":{"type":"monthly","days":30},"bc5e1e72250c4dc338ad086af82be626d9c2de0b87fd27f7b4700ddf32b30481":{"type":"monthly","days":30},"5881cdc5f3ede1bb1e3fdba2bde3e27a05ac06311fd8beefe3249303cede5f69":{"type":"monthly","days":30},"591e3ec3fd3e22c3bda43668b4c6f409888e36b2db5700d26a8bb2a0a21b3967":{"type":"monthly","days":30},"e17a7a1afd0852d04a8f6636ffd5ad3d8af7e91049e84714d776179231ab8ce2":{"type":"monthly","days":30},"39558c9d6ca9745b221eabccaceab616afb3eafaf2aef6593372cfaca903c5e2":{"type":"monthly","days":30},"1813334b84a452063bc1005ae2ed33c632554a8aa9cc72e0d14c72d92cb62546":{"type":"monthly","days":30},"d52adf3e8fc3492f8083117493b53c762b0e0b469743359f75c152d04a418015":{"type":"monthly","days":30},"c6b5b5a30c3aaca4d9d3b14d69e830b536d3f15ae9aec0d850e4fed1119ab751":{"type":"monthly","days":30},"f627011455ebea05ad73fbfa111ec795c2fe70d9975af543def19e419601040f":{"type":"monthly","days":30},"6bb0e932e7a2822840384555ee696a75a814694324d127600d1a1ffe7c08018d":{"type":"monthly","days":30},"281073fbaec7a78fa59fd05c4fa4ffe61a9419ca6c86d8d429e47f547cf5c43e":{"type":"monthly","days":30},"221dc77e52e4346a5cc9e8cdf67433ccc686b63a03d201e57f90301818260de2":{"type":"monthly","days":30},"981e402f27d58efc0032553e1452c4f5de9469c33400ddc6a59c70e2adce0dba":{"type":"monthly","days":30},"d266695a0b5f848e43814a89557867561cd42562a672273c095cf52d4ce6110b":{"type":"monthly","days":30},"ac740d8c1c14b80c4fde1e595d8fbcbfbdfb243dae7b7fdec3c36701ad8c55f4":{"type":"monthly","days":30},"eca1b4137f7e89b44cc5956b02aed27975e3f4b5504d1cfa3957721180ceb139":{"type":"monthly","days":30},"04313c74d62c93e4acee3c28f2b64b2ade33f521f4186604250b23d3843c12b0":{"type":"monthly","days":30},"548d39ce7aeb69950e1d24848fe392924cb738cc8f0875c8531302e1e147a51e":{"type":"monthly","days":30},"0ef78600f8973c141ab7f0dfbd91ea5d87563dd3b0b8ffaa8925a918da6157b0":{"type":"monthly","days":30},"c61d27f94cbc64799d72b02f8a03a8a574946e126998656a72be7b3051beed2b":{"type":"monthly","days":30},"428321582633d1b0cf242cfd5c7e48f2bd9b49bf2e9968ece771b4db60960368":{"type":"monthly","days":30},"2ff9e9f8f3367f8895563994a74b84606ec6e77f830c138cea2dc811a3876560":{"type":"monthly","days":30},"fae5dd66603074097e94445e64fecaca1c03a795a36514506609a0b7298c9df8":{"type":"monthly","days":30},"dd9f34a0dedeaf6874c08c8a9d2cd2cbe1d6d93409f72c53d53c60cdde071db8":{"type":"monthly","days":30},"b7b02c8fbf833f737dad56a5b02e55ca9d9ae37fdc49be14ef2ce2b436b7eebe":{"type":"monthly","days":30},"b5d9e82b082ac6ba5804a08bb548d8558b70ccd56f583b0c0f760261b9011f6c":{"type":"monthly","days":30},"dfd274c4df33197881ddda6052a4c8d08cca02010b680d69857c33152afbe3d1":{"type":"monthly","days":30},"60ef8e87e749b14afdad24ef1c239b3d9d6ee30e157de7a2b12afcd7d21476ad":{"type":"monthly","days":30},"6b061b7b50542751c0174480b7943a249f9cf61580b7979b94d665d847926d25":{"type":"monthly","days":30},"8f88f461e365e58414e87be4b6fadc857df50606bbb1938d39b4ecb65e077d03":{"type":"monthly","days":30},"695982adc04a588172785a652c12bcb67a796d47a0dba2a8f1573761dc35a6e3":{"type":"monthly","days":30},"ce64207d38baaa0baa54a3021c8eec875b8d73a0063aec5b12e13dfd9977e80a":{"type":"monthly","days":30},"23f8582edccfd0aed13f3e174bab28c238b7a9502d5452482abf5f4563bdf594":{"type":"monthly","days":30},"4c7a0f7ba689b5b1cf4b068df7f789b55e234392ee2a50145325292f5786c9e9":{"type":"monthly","days":30},"47a7f75e6e31b7f8cd35cd127763f1d13b550dfa396017032fffab09de47b34a":{"type":"monthly","days":30},"fd7b7b91c3fcbf7cf8455d9b7e22e448fe7e517222f9bcddaa3ff94848dea884":{"type":"monthly","days":30},"ca11667ab2ada88a3a6cbf467d17d15470af2f9d264220132d9e883830daf12c":{"type":"monthly","days":30},"a9644154ce7e7f5862f70b86a2fca34ca601b09f9aced3e43027d1dc697ce5ed":{"type":"monthly","days":30},"00393e8c404bda929fb6c06ca92fb1d9da89b85f6e15bb850f60ee70ac12fb54":{"type":"monthly","days":30},"a37fd0008e7274bbc9e7349a4cf1801255e6c7c0588e21f8d0d7e5acb6fbd846":{"type":"monthly","days":30},"d797f40b487ed64bcfa5f0cd2d821d1034a106be69a8b64aa7ab52be7f5eee05":{"type":"monthly","days":30},"7dd5f35428e02ede2b10b46eed9b42976623ce103cf2e0527f12b2e5aec6d14f":{"type":"monthly","days":30},"e0a9ef68d2dad7181878023028800825144629f1d1d5b88ac523239387971a02":{"type":"monthly","days":30},"783ef5050303c05cbc036211e6d774a6b1d0814cd3b4d3fe796d9c3388b9422d":{"type":"monthly","days":30},"c869cf33ac5456fed418eee501b816bebc16a6c4ff9d0eee632150793edadc3f":{"type":"monthly","days":30},"f038f376d4be779901655911ec10047274d308d4b51151918c1668b3c5abfce6":{"type":"monthly","days":30},"6a536bcc9c42855dea7e6e10740dfb5183d9fe6fd8fdaa49b725b9fa80ad922e":{"type":"monthly","days":30},"fbb7830b315725674544f0273f2c20a4d39d04f61e04aef69edb0352ce513ba3":{"type":"monthly","days":30},"93bf0c8b6ee1a8fbace7ba75f1f464784a79d36e62324e8af5d7777325de22d6":{"type":"monthly","days":30},"3d961daef9a59d58f1616b49fbf36a3f58debc15acae201cf11a006c78ea2725":{"type":"monthly","days":30},"2e8421f8778765c701255038828f6dd78d3e9668169b7a43ec7a6ebfd884f822":{"type":"monthly","days":30},"5388992c823a942ec969e5ed394e611bdb63864535c28584475e124c20c282d3":{"type":"monthly","days":30},"7869ad22f90e188c2d2e34126b652e64f3203942099cb6b9b51850325960d3ca":{"type":"monthly","days":30},"eee421bb2c94e54fcac2b4de17867d3f7843de318819747fc49e907efba96093":{"type":"monthly","days":30},"7cd4b8c76787d15d00cfc4c4efe08b4a41b7230a685a80c0ebdbcf1cdcde804e":{"type":"monthly","days":30},"9749ace6c62c2b878bc467b09c2c752bb5aab246b7ad992d4c1393e49b9a1610":{"type":"monthly","days":30},"69d448501245b82df5f6d4d546c8b70f920458ea2c26292a422f21c97ebdd239":{"type":"monthly","days":30},"58ba378a127fcd0462e3cac8001013b9f24286ced8472a22ff06cf9614d47834":{"type":"monthly","days":30},"7ce1b615dd0fed7c85b146515fc4755703768ebcc7ef54589dbe58a2fa39e928":{"type":"monthly","days":30},"490ef64017f514fb2b2886e3169942d9427784fac4e485ed0743ad58b97ac899":{"type":"monthly","days":30},"bd0905d54b625f143681d046996f8c422af4a2125022d14be023371aba713c16":{"type":"monthly","days":30},"2b5a4fb2aa4fca4af82dd0a61e0de90955827266b1c5f1c0eb9740e47aeacbda":{"type":"monthly","days":30},"b429e4877020e579d7696e4ada648dbdb0d63734e3a34e13c6e318e95ad1b329":{"type":"monthly","days":30},"8199b68a6090e7a29fb5fd06929e482c3c8021e7860086e947453838dad9258a":{"type":"monthly","days":30},"fb18f6e5abf06a825934096caca4b2c19133420ebeb37ecb880f694283aaa34c":{"type":"monthly","days":30},"7986a897a55cecdb3f63ceb562afe35465efaf37ed15952bb46e960684bf3f08":{"type":"monthly","days":30},"5d0472e567be14f0d45d78a08e2401c559bb9186dab9a19d58738423e3729c93":{"type":"monthly","days":30},"ec0019909e5a671b696d1f4f9f7da8ea0ab12fb9baa8df833c13da838a90a8e5":{"type":"monthly","days":30},"f2155662b873afd2a25a32c4d18e0fc30f0737f0bf66d67098c0db5478fdff2a":{"type":"monthly","days":30},"2a3dcf09a34e1bae506eddaca532a3eb0bd686e50bb897a2db9ac74cf361eb02":{"type":"monthly","days":30},"786ef790ac480a091403a7f78540a0732a9db729a5145d5a6c912cff0f4f5308":{"type":"monthly","days":30},"cd63785919bdc32bc3bb172f866ab47d07985ec50829c61e0dfa656508fed84f":{"type":"monthly","days":30},"0c3933c919214892d087b77e4ce5e3ffd3dd04388c5b9521d2457a9dcfe1a8f6":{"type":"monthly","days":30},"3fe82b492e715f634f55a1611b81b2730bd18e620be9f52d19bb923498a4c939":{"type":"monthly","days":30},"676b6dd7eb07d1dfe226445293eb33f6cde5efb20792682bf4537473db9fc8ed":{"type":"monthly","days":30},"e5fa0f202f6f7594d123de47b121ac3c127e6ceabf81a701e9922c6429cbb768":{"type":"monthly","days":30},"05f4a628fb0066e2d8df2a5bdeb998a02bed3a5ae96c3c4073d7c34c1a5fc975":{"type":"monthly","days":30},"6a9421e8fd51a6acc0d553a5783ad9bd8734bb9d7febd51ae710997aee8a943c":{"type":"monthly","days":30},"2d1a7d6e641aa44761519b1108b2604e6857cd60404e73ce76777f7f2605b3fb":{"type":"monthly","days":30},"c4c8f53bae9d327be7b4a4bf7a3c7d9c50bc7d92044cad93738c5cacb0bb4f24":{"type":"monthly","days":30},"483da4a5f06a03d632bd6259306ac44c83a422a6010c4954ecfb70cdf6f81840":{"type":"monthly","days":30},"129f8a48c1dbc906e873dfeddd464f07d643bd34973a0423fa65a280882cd43a":{"type":"monthly","days":30},"4f70c1a9fe6c20beab2e1ae05aaf7af3b3ea3f1294b37f619b0e0bbf6f6ac2b7":{"type":"monthly","days":30},"c038c360b7f2e9266c174f6839ed4172adee11bfb7cecc1f42678a542f492114":{"type":"monthly","days":30},"3aae6846bcd49400c8517a003f58c0deb90efc4f526449a1f489c805b713f071":{"type":"monthly","days":30},"53001d3f2ab04ee9044bf5a2d64ffed19b89f0b29c1b75218e2b6579ac882968":{"type":"monthly","days":30},"f73ac16242c9bf366b38e9886c6a785fb9fbc8eecfc762dc87cf1286e9588989":{"type":"monthly","days":30},"8537edc5da815de38aa973431ab51abdf0fad4a9c3e6b140e27dc097770ec3b2":{"type":"monthly","days":30},"6f6979548fe0e525e4573fd5c2f8cb88c2f685f6c7ed3513ac8caa6d37354014":{"type":"monthly","days":30},"e6a4bcd534b8c882ca5f940c85a657105ef09a4b75336c3b83f485b60ce4ab1b":{"type":"monthly","days":30},"8b27a074322515a6baa857d3536e9ad70bdc1323ab26120ac98f8d550dde56cb":{"type":"monthly","days":30},"bfe9bec302ced3b3b81560462d3382ae2002a100a0c8f7ee21025df4fb56c57f":{"type":"monthly","days":30},"feda0cab21f6a6141ee7b31925984f82fb8aa3302e5ad9c1f18ac914fa1f2b86":{"type":"monthly","days":30},"2f244f4038d83a517c1e88684c3cea2269112b9d90558b1cd2082e4ee6e3d92e":{"type":"monthly","days":30},"0e7dee9ce03db100c1bbe96a5634d611c2118e5f95d04bf6f493dcceb02a8ba7":{"type":"monthly","days":30},"4ab13cfe89d97cac885c8d94a6f89c4e83f788991ee30fa3b1491fbeeb317651":{"type":"monthly","days":30},"f4889b903f496def8e1e2e18c28197c20bf37a70f3b0ac1db4ed67836ea20087":{"type":"monthly","days":30},"1d883b2fca10689831eabb0b92342f1655b76196acaa9168a5d71d5150ce4725":{"type":"monthly","days":30},"2d92284a0d4e8e9b511004e245bbb72e683cdb9cc15136fb9dc9fba83051baf3":{"type":"monthly","days":30},"b079ff676a572edc857c291fcd9d8450603d4c809493607d70f497147d7f668e":{"type":"monthly","days":30},"dd3b9b56665ef720b87a45a88e85904cc01ec2ed8b04c18d05be1fafb83b4e7f":{"type":"monthly","days":30},"3b51efdf9b33d11d6d49c72ba9b93c6b09a3a7e261223de427f00ecd9bdf20cf":{"type":"monthly","days":30},"1bcc4a3f9ca6012e0fa125b9973044db7a55e5f896f9aaf48f7c5a084c5e157b":{"type":"monthly","days":30},"7e8fee0fad8da48efba97af16598462c1bd8e24d2a279d6ab3dd6b02c3cdc4a3":{"type":"monthly","days":30},"dffd4c8a11f14c2f20c47cf4213d4856f2479281e9361b901bb808e60e7a3f6e":{"type":"monthly","days":30},"88197563baea5969a14a702a425096dc210f2e89dc334c6d6422a26993fb6177":{"type":"monthly","days":30},"23e13469551531dda01a93a74b312de2eefc56c71359c630df6d0889fd451644":{"type":"monthly","days":30},"3fff7f0c6838f810c75bde23d7ef150c81f4e02dacbab48f186ca5910436fb15":{"type":"monthly","days":30},"07c31ba0de5d5d124d163544ec1615c40cb694d9c9854a7c095b55991d8c7014":{"type":"monthly","days":30},"18aaa8d34ebac7a86110a2e9f2325126f26856fb53378e5765b8d3d364d53b82":{"type":"monthly","days":30},"76dd7079756118e54ceca95466096f7f960f712711303f2ff2b752371c7e9ad4":{"type":"monthly","days":30},"01f76cdfa60ab0e53e1c92ec9ea859fadbeedcdd05918b8230fae40a4a2f11f8":{"type":"monthly","days":30},"3b0329f208efdca4f0726813c4f15a2b7f093c1a32ffd2c3c82cb443b4c7de99":{"type":"monthly","days":30},"e74403aa99cea3eb087f44987ba85f3a6682fd57f7f307b8d587afe72c642ddd":{"type":"monthly","days":30},"e0ecc4b7954512e8a333d666e95dba3555dd85a1aaa9b566281af96937f696f9":{"type":"monthly","days":30},"e445081beb5550e7625892667401b90e02c1964ccad16ddee1452c0e20a12b17":{"type":"monthly","days":30},"6f3fc8a1fd607563510ef0a38a975e4f78ea19ef756416c8afe06d3bc7057f5b":{"type":"monthly","days":30},"d54b6133c6884ca37fc3411ebc62e833d1749d5347217cb7dadd2d19d38e6323":{"type":"monthly","days":30},"9ed72fb2dd9a8353d5eddcde2d13f77cd9e4b92d3c2610ddd2752ade4a72bcbb":{"type":"monthly","days":30},"91d8b446f13a6b9f7db05c7cc189efbcce7452c8dc8e62a7c92aa133a205e55c":{"type":"monthly","days":30},"939b959bb00b781c951d9ebc287c13be025af029ff1910f0cb85738da9729f7d":{"type":"monthly","days":30},"8b791cbd82c1b7c58b6600616a4c1d574ee9bd68783854fad15e66371aedc7f3":{"type":"monthly","days":30},"21ba57af102dff59d49946a7f0f33adc8a0b6507dcd482bf0c9782011588cb8a":{"type":"monthly","days":30},"87148f8dace5253fba8c46bb2ebfaf0c960209378a2baf2f393058f345ce4b32":{"type":"monthly","days":30},"ac9831500b81d506b56d84896c998da4b3d1be0bea89b73f3c90d8e32f3dfbd1":{"type":"monthly","days":30},"7e0b274213b6ef4176f2c1e8373600d8a048d48371bb88bc97a2eb4c5b875e8f":{"type":"monthly","days":30},"e79f7a0341cbcf0cc5da40c196dd7c19ec8d51e5f586e6da31d63c88d7c856c1":{"type":"monthly","days":30},"723267f63fc77e174a1ce518804fe163ed23ee787fc17b283d1aa56733fcbf33":{"type":"monthly","days":30},"65d41defcd4a0723c15b2cc9441a57cc84fa25a90434744cd628e185b459959b":{"type":"monthly","days":30},"00dc882be47e47e3efde0d6500695774b911e09d5371ee8008b1f57d55f987be":{"type":"monthly","days":30},"c161facc82a9105c18f709166488bcfa86ad6e6b0faa941fea72f29ff975701d":{"type":"monthly","days":30},"af902e581fc913b1334d535beba28ab2f5c36e98a753bb3afdd0fc5f03fc8912":{"type":"monthly","days":30},"78d28246885f7ed1fd695bea3d5cdb10d296f783c70d65b007ba2c161563624c":{"type":"monthly","days":30},"d0e3ff0ee6502a8e385658dbc262d40e859e809ae810eb870a3ad4b0a9f436b3":{"type":"monthly","days":30},"790bac934e2df27a7de6e834f94e1197215581da17234382a1435aaae022dfcf":{"type":"monthly","days":30},"67c0b13ef7f50d00a59fb1ac7d51301e6620bff0a8ca240802c0684ff7df77c5":{"type":"monthly","days":30},"a6f0156cd7acea42e6a7bd091e79769cb93d8da5bc62b78604b854e7848a340c":{"type":"monthly","days":30},"c0ba03ab0d35f406cfaa6a2dae10aa98b0c2e026eb504c3c1b42440e62a625b6":{"type":"monthly","days":30},"b9b182268ac5b55ef0d434ca7a906ed52f6900e82cc8511c39169d7b01d5e126":{"type":"monthly","days":30},"5fca291cb20af3a1362959451df095e391d2a48d6f7142cefd37ce35867726f6":{"type":"monthly","days":30},"a9a32aafb49681596dcb7991806fbe1c226b6454adf776b651fe0e26cbbb7393":{"type":"monthly","days":30},"4c24516ddbac844a995b6c490efc4e53eee8db82ca97100a19cb77aa92d32c45":{"type":"monthly","days":30},"41a7ce2fbe8a7a94727db2cb6f0aa97f1a9e4d7c3bc7165dceb05c4a5efb1ff1":{"type":"monthly","days":30},"19c4be7cf06e530dd0f98dc9fe0a3d13bc7c5e363518c8db8cb076b2adff49bb":{"type":"monthly","days":30},"d18f881d5d3a91ee9ce94d211252ec5b19fc481da7c48263442cb2cdafd16853":{"type":"monthly","days":30},"231e765277df802b53b484df879df34bc5da09183e1fc39301d1d96ffaf057a5":{"type":"monthly","days":30},"6351b545f2bc6adfda5dce352a17a7078c2481a5024d50a85068ff68c7c21d32":{"type":"monthly","days":30},"5f463e4462817c3020f3569c5ff70bcfed08d2930a69da47b50b3f0b3d5358cc":{"type":"monthly","days":30},"d0d371dd817e5c6066e240d2ede89ff7c1e6e32752a3990c69335aaa88f2fb07":{"type":"monthly","days":30},"81911329086b35fc81b635dc7559404a6f4f1d70aad8fe932bd43f2d98aca6b5":{"type":"monthly","days":30},"ed7bece548f7ede8e3455f519543a2ef4556f557340e4352a67258060a444a6c":{"type":"monthly","days":30},"a99ae3b9207cab4742f47f081386bae0d4b32162f224400fa776617fe0b8dc6b":{"type":"monthly","days":30},"e3eaadde5eeadd6fdf57dea606a7a7657bbf45254eb8403c95c6d31bdff7c709":{"type":"monthly","days":30},"4fcc96343c6142a163f78c2009e9a018f678297f4cd5ef3584bc78014c7ad528":{"type":"monthly","days":30},"aa6e776abbe3c855eeab2ea5612844a112f1fe93b0a91936d5970652a7cc839e":{"type":"monthly","days":30},"1b75c5ef281f817dac2f35a5f6c595f4f2f0c64fdb2da642143c3092fbc19d5c":{"type":"monthly","days":30},"86bc82b08070d9b6a3bf4da2222cd95037ce722b110db71e9d4d7274813e3e83":{"type":"monthly","days":30},"e44cfb37ebbf587e78de6d51f008fa9557b816ad404532d8f3e4ca88e404fb5d":{"type":"monthly","days":30},"e0905d166cac984b8db11fe02181dc1b23e507613104d800abbf87d853db6a4a":{"type":"monthly","days":30},"4599bed5e49558ee919569309a2eaae2a5a49a5ed36d14a4f14c3a063d7c47fc":{"type":"monthly","days":30},"bc131a78d4d25ca8e4ceedc7f471a37370aee833e4b5a346889a13e1b3ab2651":{"type":"monthly","days":30},"122c1ac0e373822489849b028df29e4be910bb8293a2f2e46536356940358de2":{"type":"monthly","days":30},"53c0064ba51392eab8c7ae57fb11e8203fb4f0358fdd059299735f0bef086131":{"type":"monthly","days":30},"5cf79a667d76a36539214cdd2641dee73ab9a30ab8ce9cc2985f6838e6da0138":{"type":"monthly","days":30},"c72924480e6359061e266f966fb9d9ba7da76927d76f213888dcc66dc5bafde5":{"type":"monthly","days":30},"ecb375472d947c978f286f98ecaa5bf975c220e3f2bf5eb801333ca1b2be7548":{"type":"monthly","days":30},"072a12052265b61c6975fd4f3ec43dc85dfe7ba126986bc5f5c832e6289be75a":{"type":"monthly","days":30},"12a809898d118f90d74e5f32089613db8fef125f6c5e9888d68c1f121be2fef1":{"type":"monthly","days":30},"8ae570f57bfe8ad93be4b5260717b60b167999e24986d08f22bd301d530d8b3d":{"type":"monthly","days":30},"31a3fc99aa52999219baa5f1523c72cfa05238bc7a2f213e5673cf420689a818":{"type":"monthly","days":30},"002fc1e95efd5c46526c4a5e749bcb5e3f5376a4410b84d28b2de6c790576404":{"type":"monthly","days":30},"6351e64638538e21dc07c3b598d47afbee144ebad46bff8a586f86b5a113df6a":{"type":"monthly","days":30},"e45833e9a190c9f0482b62fce1b906b06d61138e123f78f25f7d8b94b7266acf":{"type":"monthly","days":30},"1da266d2f91fabe524fcb0b2a824494c7536166573a1dc4113e6bbf77cec1c98":{"type":"monthly","days":30},"f0dada8567fc0f47132e2085084b3ca75b187c9c3df58e36e7d9234f68ae4197":{"type":"monthly","days":30},"42e1f354db82bfb45c3889b3f4f3766595d0c80b1a20661e6a932ad55307452e":{"type":"monthly","days":30},"b3c5c97caba6ac47f36c8ba8e4123420533844c4bd35e941e6501bbaab9d459b":{"type":"monthly","days":30},"562e64dc0f447fa73f5f6e9711a7532686bcef842e27298117cd2c59876038ac":{"type":"monthly","days":30},"f33728b542a044feac7ab7e82a0b82bea2f9d4113ddc0808dbbbe38efa41b0fa":{"type":"monthly","days":30},"551767dc4bd9aab5e5b060cf510455e8a243f5e0a66d417d6aa5a8083962cffe":{"type":"monthly","days":30},"d3af09ff15541b8b36504542914ffd6e47d09d5672711b9d041cb0919b34ca61":{"type":"monthly","days":30},"eb300a698b5de04c0778da30fbcb7e1773c83217fda0982f24208daac3b16463":{"type":"monthly","days":30},"b3fc0068f07340d62f61a17c4c64111b27f7048e2b108e9d4ce7ee4fa187cbd1":{"type":"monthly","days":30},"3684e113768e59441c8b5183806696c992617bc86a622ca047c87fdac60277b5":{"type":"monthly","days":30},"c1a5e3cdddbd11a7a77d86d90298165d28343b6449252639ad0709587b7ee3d8":{"type":"monthly","days":30},"70902ce69821e655b8473a24a93a51b3fd4c660a8cbdca202a87bcb3957a2292":{"type":"monthly","days":30},"cb5bafb90b316fc398cdd3723b5056c82b68fe72d0b56c263e3b67e221355354":{"type":"monthly","days":30},"c9b475801776a00f9db7515e7420bab5d52f955c3a238b2e30a0ac53610b6b61":{"type":"monthly","days":30},"8a86f3bf32ac63de0c1b38cf7257e05e8585c99e01f7c3d6f1500a4b19af64e7":{"type":"monthly","days":30},"cd74cb195469b25f97d72f7a452a9ee6736da5232fdabe1ecf687185abec7004":{"type":"monthly","days":30},"7ae035d490ce237555471ed24a1c77f6e3813b3dbf5f40a926920c6d6065789e":{"type":"monthly","days":30},"548bde20b232cc372a45b8cc97ced387dd235de1b2d926182158fd234600c4b2":{"type":"monthly","days":30},"4a962883e9868e95b84865c4efc610b5dfcb7c0f6dc24ef0d1b87ece021a1345":{"type":"monthly","days":30},"a20f9b6c9555b562da18465e36e4e83a1b81dfe45b34d7c54efce6f8fbc83963":{"type":"monthly","days":30},"bfa38740c93765afc857a96775071c945313a55be7530608e0bfe832a93b6673":{"type":"monthly","days":30},"b2a449b79047761c7ed5388af03d62db766a370084bba8f75c6f5a7c2a64945b":{"type":"monthly","days":30},"778ad1ea5c2f87e50d817a2103f9e4736d3428fec92b60d91f439ca2d9326dc5":{"type":"monthly","days":30},"a898747be78adf793d5b90476bb50b841264573bffb3480e53f3590a9e449f4b":{"type":"monthly","days":30},"cb9b4d4b779d8c76034d30937e249adc92931331066a5e3c3ea482752166cf5c":{"type":"monthly","days":30},"aabfe5f8049b46dfc49be134ed495ffa9a0632533bdd4fb37ceff08db15d27d6":{"type":"monthly","days":30},"c8f4bd40c65d36051ebb7a4bc97a4e130fd4404855e75b29b4bd4ae4520d73c6":{"type":"monthly","days":30},"e0abe2d8013030381724187fe6eef8f669b445c000218c37edb5e27435f64928":{"type":"monthly","days":30},"3029cbfaa4f347d2bf1ee289f35d26d64e30a6ae876703b8f62012eef9843eae":{"type":"monthly","days":30},"38b57c149e43b2150615ceb4dc65ae97d8ccc4af780c5473fdc4bb2443590624":{"type":"monthly","days":30},"91939474012971463e3f0dad4e80e01f0c695ffa36babda991faae2d38747594":{"type":"monthly","days":30},"68371f425fd68ceb4e34141ec08116d7244bddc2decab28edb47354a53800319":{"type":"monthly","days":30},"8891b751ee2c1196b8187150dc02fcf79c458aec4282f3344d6c884b2fbe1872":{"type":"monthly","days":30},"a948bcc133df9ec3493c5fc7d03feb03d9581a45700d8969f92dd8cf3129773a":{"type":"monthly","days":30},"ca5650f1e7eb21d23f8a87a20aebfc579ce02b908aca75971c00d52117355bdf":{"type":"monthly","days":30},"b56b66536920a222cc9b62d7b0f0023be74e67bdd4823938e1863d77414492d4":{"type":"monthly","days":30},"ddc23d5f93c0e8ec2f9639b81e7e9c286d55a6206070b23ae8e2ec64ad3fb5aa":{"type":"monthly","days":30},"f4f50ba83bcc282edf609035dbef9db64ecc9309b3a5ff300edd61c5a114e738":{"type":"monthly","days":30},"ae9686e95e7163f6984b2fc5204e2fd9bb4b41713879b9e9665d1c8ba9bd3a3d":{"type":"monthly","days":30},"0b31d174a330b5d58a7c1c2d756d5df6eb90b898b3a81b7f08d7bc51046a8079":{"type":"monthly","days":30},"2bfa1007b42276c850d3687229ae98fdf068e4e87e8f597792c6e5a77acaf6aa":{"type":"monthly","days":30},"8ceee844955fd7b64077c8870caf639a93c25f83929d442e697a772bf4d16bc5":{"type":"monthly","days":30},"610ed97db57b0e20532f2797c616a028a1be71806a77f63d84d794c227eb99dc":{"type":"monthly","days":30},"0928065227dfdb8b4e576a1a3bdcaeb0ba16a962909373a5d8303547d1842678":{"type":"monthly","days":30},"099549e3e4bb1d4dceb03c9cbeb32a73449978da85446938f680da9b3f5bbe9a":{"type":"monthly","days":30},"ee0e3d8042cc050dd7c37de52cb6404772e6b0ffa405566d87cb49718e11f2d4":{"type":"monthly","days":30},"0dc8eaf31e7bb2e1c2a00bbdc46da6cacf612c0aabbb14dcb0123e2aff95c5ad":{"type":"monthly","days":30},"3cb8472854f1d9a9a85e5485e6c85c4cf0462fcc74d51bc674d084b732e60b91":{"type":"monthly","days":30},"10001c231fe9ad0d3c2469060ac659b0580577daccb9e773eda6dac36600808b":{"type":"monthly","days":30},"fd8d1594dabbb9a90fee32c6d836b76a6ce582bbdf48e550adc3201669674879":{"type":"monthly","days":30},"d99b67475c37e9b015f8cb68ba93c8631bb658688e3f30fbd1fcfc3518fec802":{"type":"monthly","days":30},"578bb306795d8f391197e509cfc7819e2699ba68223a477abf6cdbb0ef7d1b87":{"type":"monthly","days":30},"9a3a6a791d063fa896cc84e2c7f4ba95fe0be9df535bbcf67617cc37b6cc19cc":{"type":"monthly","days":30},"f21f5d2138e198ba9922017161181a50a6d1a07bc8c36d5e2abe3cc7f7db19fa":{"type":"monthly","days":30},"185e6566e1537b4414c47072e6799bb2f51267e2e0dd4b43a26d2ccbaafe6f6e":{"type":"monthly","days":30},"8c93c98a57adc4c9db684ddee98887fb3be2b38252d5be90176e3b09fa37ecc6":{"type":"monthly","days":30},"3de543e81d03900b2cb48862813a1fc40475afb92fa9454345790e7dbde935ef":{"type":"monthly","days":30},"4308d6356cbf520ec3f898e18f9d18be16d6f596f6b70e8953d96a1c170bc9fa":{"type":"monthly","days":30},"feeb489a8fe1193eeea5746e3cf59382172d11b5c7e15eb990df040b62af531d":{"type":"monthly","days":30},"6d280099bd486b418576bb14557dfcdbc818d814e68bbaceae176816d73a16c2":{"type":"monthly","days":30},"91fe86349f1936061b47752487aaab8c0d3aedf6d766c57316d9d5939eb72e3d":{"type":"monthly","days":30},"437d02d96bb3ad7eb22841f4deee62aa4eafbbf07e3fef29ad265955c9badaf2":{"type":"monthly","days":30},"28e5e8b018e4bf569ea89abe5cc23d0df85e633d3a5836ec63ed8198ca4603ff":{"type":"monthly","days":30},"fd7aba30acd1bf1d0c73b98170aa488721573a451eed1aeefda0c06e81c33b53":{"type":"monthly","days":30},"4db96c0f3ca2880263f301472a9e00dbc6fa729a11dccb92c394f650643c15f9":{"type":"monthly","days":30},"1d9445235187bab90fb3507225030c55b921e9bcf68087a9da934c2c300b3330":{"type":"monthly","days":30},"c6bfb164c76d33861ec80b5db19d4f63fe3cf3794ae466008f3452196060ae41":{"type":"monthly","days":30},"5094d0e19f5b1c1b519d16bd71ccd934466e5d3dc0534160840f00c0b81ee91f":{"type":"monthly","days":30},"625a4f8c12911ff52d43bd98210849a3fc436783f505513fc398a3fc1245d4c7":{"type":"monthly","days":30},"604f12d0359b21b30ffb0a28b966bdbeab96f9918f1ea9447ea5faacc6489288":{"type":"monthly","days":30},"526a0ab7573107925aeb636dd4632817bdc1e59550e4478e765bbbd30acffc52":{"type":"monthly","days":30},"910d7b9c9c6c38a41eb25a3ae2e9eb50480d8b7c52c3c26fcb7fd094ccd2c78b":{"type":"monthly","days":30},"be9ce4148369f3401788e95be9877b3924f17fca4441ac67295700efa1ed2acc":{"type":"monthly","days":30},"ba58b28c68c3852589cd4d3a1647d56a09bb63a7263faaead46d057a94bfa2f4":{"type":"monthly","days":30},"67e14bddbeeee027b54718a48ff2140fc488f150dcc30fd977ea255911e92db7":{"type":"monthly","days":30},"b6dbcc7a59066e69c147893681fbe20afbebd915c91a0161434e464d65c73093":{"type":"monthly","days":30},"78b8551a8a8eaba5c5651092bbd653222dca4466d1af7df727caa3ea7fcca2ae":{"type":"monthly","days":30},"4ca613838a1bd6a6f3db16808859c52edc1c7486e54406e825b15d78f968cb00":{"type":"monthly","days":30},"c49d2683817b5a73a294571957786d394fc28acea0d7c818416446c606d062ce":{"type":"monthly","days":30},"f6baaf6a3daca24b50560f07960209d0b6a674f9618d500da9c5f9af3a543733":{"type":"monthly","days":30},"6f63e73402f33d19e8feceba502947d1101d12f01932af40c358a3584a98029e":{"type":"monthly","days":30},"4be4267be6399d11abf9359070f50418604b4b7bac4d48b9204fd83bb299f394":{"type":"monthly","days":30},"c1047b5aa1eb4b7cb36178ddaaf74c3613c4bca902bca04d801cfcb0cf39e201":{"type":"monthly","days":30},"a83717a0f7b7350102e4bed917ac10acd9237bf1b0ded76ea4be5b77c2b43968":{"type":"monthly","days":30},"f05324741b1e0cab7a4d8d5fe8004584ddacbcd7a6f0356bc6b9976b31800068":{"type":"monthly","days":30},"ebd01e796849a8554b90b05c72de36bb538a89877e063ca185e5eb79acd0f564":{"type":"monthly","days":30},"ccc7c408d5c60bef0902d82cf858ed775a6a45ee231b6ba99504ce2070a225ee":{"type":"monthly","days":30},"0e33587907b7560bb1e20db4703586adc7f6b0139bc4d266887a1a0e327e8cb3":{"type":"monthly","days":30},"77f79e6770067bdd54f97b6bdad65857450795d2b09d64663010de04f12ad0de":{"type":"monthly","days":30},"130b487ccacaa2306a035f17d3a8bf466cd0c6b7e5ac1c5809c47ae7935ecf21":{"type":"monthly","days":30},"cb45bc92d8c381cdfeba4f538f30e9753f32265216714384374366cd731b4479":{"type":"monthly","days":30},"8475012883a26dd23421272de3ca73e1fe3e8c4b1b8639c69381ecd9f224a4a7":{"type":"monthly","days":30},"74d402ccedc8625faa395d25a885444f637b4770cd27559708db4f5ab99c3bfb":{"type":"monthly","days":30},"11eba4e950a4a10fe73311884e6feea2d3fe108be6e2cd42b2062d9ab7e53f19":{"type":"monthly","days":30},"7eb60c65bc48d797153c6bd95b82e033c48956e930fb6497c5816a28aa131e3e":{"type":"monthly","days":30},"909d6833d74c9173de194c082ebe1ee62a7064cdc47f3599dbab616c3c24261d":{"type":"monthly","days":30},"a699975242900ac21c2ae1e7ae93aad2c16a932509122235676cda0820b9ba3a":{"type":"monthly","days":30},"0f907b540d7886d9ebbbefff6cae80174d900fed4354e48306804884bdd980b9":{"type":"monthly","days":30},"c2fe901f53629260b2c404e8cf14fc901f02dd548a6a24bd1f07b469a5492cd4":{"type":"monthly","days":30},"38272feac087578046a40e2379c8c336032bb9240be0737541153d417b1f2008":{"type":"monthly","days":30},"3d5de0c8f9efe8c9f31b20ce68a6a13b2c7b1fbec5e0cf5dbd84974728a1c513":{"type":"monthly","days":30},"81d4708947e0c7fcff0504505a6a07f5874c0b86cfd8bf2637e1d6698077a363":{"type":"monthly","days":30},"20e31d2e701fbad16f445fa0c4d3fa566e4f9a2144c94c5974686e1aeecf160f":{"type":"monthly","days":30},"1d34a620f0653dc5cf1838580ed7f5a2d211befc572ce923987b8a941c811f61":{"type":"monthly","days":30},"1abb639474f2c7c4e0e3ffe2a0b6fa807248478a57c35fd208ac3ef4b1c8f729":{"type":"monthly","days":30},"0b3000b46c1ac623e8fc52fcf7d4aef61b5d74b57af886804a18a405a12a940e":{"type":"monthly","days":30},"c376f452b7feaec82c566671bdc2d67e67d59f9389a3d008ce531cebac825307":{"type":"monthly","days":30},"5c7dd6d093ab5df654724dc67c0d5f71c752c41bd7198d22454532780fadcc53":{"type":"monthly","days":30},"edf597e3a28ac70ab2cd290d5e5838f8fc3ed9f64432bcc589fc05dd8dc9d233":{"type":"monthly","days":30},"da87278d6f0d16bf7c4ddc4205ae00eb8a151bf46a14af250ea2a41e0694c0d0":{"type":"monthly","days":30},"b6678fec9488e79d8a0582b602f1e2a6b82e51f75285a320fa2c79619d0eec70":{"type":"monthly","days":30},"e1bf837e473446ad6b63adc4d13d4a811c1b61631d20c895b8a5779aa800504f":{"type":"monthly","days":30},"1bc3b75752ad542c07b4569f1cd41fe21e1af6febfa0f619e5bf8d3fcdd8ee0a":{"type":"monthly","days":30},"bce90c014fcc80abd77677264a6b73b9ae694e416cfbbd0ab211d62e65b77e35":{"type":"monthly","days":30},"1b6c1180dcaa29994de38713d7a8939752d3cae63cb24fe1db62d71fe6fa511e":{"type":"monthly","days":30},"140199e24d5adc0c8c0df7c4822250ba2d19125b7ff83090469c106aa657bff1":{"type":"monthly","days":30},"c4d5cd379d2d95aa5c17aa98486d047150a10d3b42ee08e378d0dad663684542":{"type":"monthly","days":30},"541ea7a4aaf947cccc4c53c01e09094c156576f47d547483df087828d01d94ef":{"type":"monthly","days":30},"a5f8279e3b9381b68c2b5f050275e0a487eeabceddfb1f60e7ee334b76baabe2":{"type":"monthly","days":30},"63879aceef7b37437718cfe885f6a5645e734f5150fc8aae51aa144d9fc92a16":{"type":"monthly","days":30},"04cecfb0afe7f3ed1d18df63a7f3c04d438635e8d1e11e62f34ce6de97a2aa08":{"type":"monthly","days":30},"e11d738d5624ae2f7a241704829f25b699648c902bd03f326cf474f75bcf36a6":{"type":"monthly","days":30},"2ce1296f8b4c6092cfa6616aaba48b3a1490ed9f585ee4458126b71d6a6c5f60":{"type":"monthly","days":30},"06f629e6c9b6d4fd602424a3e8e03a71daf9aaac5ebf68fe2e5dc658507f0503":{"type":"monthly","days":30},"feac311f4e145dda60e93117b69b9e0efbdfc8951f80aa3bc9117c7cf5c58928":{"type":"monthly","days":30},"ecafa6d0b1cccc6333e4a6289895d94f3a470b6d77cd1f8b4f392075b78f44c4":{"type":"monthly","days":30},"1fbdc7e71d778af7ef6e38ee11aa7973c56ac3ca7d83774477a150b7939fa584":{"type":"monthly","days":30},"279a14938072c9e85cf5ca6245c40ae31d80209663fdb1c864f75986c6fb8992":{"type":"monthly","days":30},"75c3ac002b4ebfeb0b37b809585f385fd478fcad959e13e920f395277e64fd68":{"type":"monthly","days":30},"c69afbb432fa7c14914fa588e71154a8ef3b674b3211510d0e010b87ad0b48f1":{"type":"monthly","days":30},"80b65c67f96062fc123a49b9b640d514c0dadb79efd80b4e60f62b14d684e470":{"type":"monthly","days":30},"83b13256d168eac97a7669a6a87264fd61d21ae34d03ad2495d6ad83e38a8a81":{"type":"monthly","days":30},"cefc389b77075664bd5b36eb9a83828f38f32406039dd05134755e78b47011e1":{"type":"monthly","days":30},"abf29ad25698be8e351351dc23cdd4f2beb88da651c0a1456bb2c623087a69ef":{"type":"monthly","days":30},"c628f8ac7f9ae518e86ff46cb68fab98e771ec5aa745422837769f8b5426a12d":{"type":"monthly","days":30},"c7ef895997c59454d4cc2f48c7edd3a7c89aae2381e67b1298b14963287fdcdc":{"type":"monthly","days":30},"70f383a36fc27f7d7eae179ea7a465bd9fa587c39a22c66628da0d5bff35cdf6":{"type":"monthly","days":30},"3416423b1b84420a78dc8a324ce2f331457493cb1f68d9655d3cb9f9cfb039b0":{"type":"monthly","days":30},"dd7217f60e0c5753d3523c2d146d0b87442e2dbf2ea8ab515282d4e8e54d1884":{"type":"monthly","days":30},"3df4618c726040a7c8e58cde2dd1f6414f7a7b178724d14b1a28090384ffb46f":{"type":"monthly","days":30},"edf4dd2d9f15f2f9a8022d88e6301e7ced90ce6fc75fa452f0f8c21cc01fa45a":{"type":"monthly","days":30},"8dc3a11205f7861964be3d756302c80f4b14c207638b8e0a003b7f307fd56f69":{"type":"monthly","days":30},"f16989db99eb07ce5c7612ae47801ebc59ec2897ad8cbd69d8b0d770fba6103c":{"type":"monthly","days":30},"b32ba775cdb7e5b45507d6a9a2cd935e5da982a1830c7731977220cb47748fe2":{"type":"monthly","days":30},"c11affaea604c6695d782a5f811b4b220732418b9be7c866f8856f2a849d327a":{"type":"monthly","days":30},"ef5f65842ef7cb6fd4bfe357dbb6ec30608cb5b3b1ee44a4bd5e4fe7ae2f22d4":{"type":"monthly","days":30},"aa5c8ca6e74269abbc34b7dd06076a2c1eaef7fafa7fdc75f2cbc9c7a9478d0f":{"type":"monthly","days":30},"15e11973c3c165a650802d20b14135163d0238ce52018fcd130824288a6dcd6b":{"type":"monthly","days":30},"8607764ccd7aa546f148aa42ca1b73eeeaf9945b24c859c9a25576be4488f976":{"type":"monthly","days":30},"c9d79387576064ca51713df9dc3e6525fa0ce3ce3e6e2aa9af7215a1d794c761":{"type":"monthly","days":30},"b9fde44b3720aedf80a95c4a90018bddcbb8cbf17774e27314e364d243219eda":{"type":"monthly","days":30},"57f9e1b32a7cc1d58de27f558c2f02072d24619a6d51021156ae7570e655a207":{"type":"monthly","days":30},"5e8536352fda4dd7df153a2321401285f688f8cd0a808cef664cbba3d9725feb":{"type":"monthly","days":30},"10d703473f33064e550869f74c5fc0aa78719d92aa22f9b8d7f6e75be0eaac1a":{"type":"monthly","days":30},"920a299bc755465ce24c5a51f012c5b197a4bd841be89782987696f661d51d65":{"type":"monthly","days":30},"ba1c715fa2daf05048ae018a3f1d0dad2d1a0773da5a8512e2e1b58489cc27d0":{"type":"monthly","days":30},"002847fbb9a3fb6154c1352028d7e1b4e36ae65e3ca0f306ed9259cf11edbdfb":{"type":"monthly","days":30},"edd4a2b872c08963507302060ed67909e2045622a9df69754889ab8652f5220c":{"type":"monthly","days":30},"51201408496c34ecb36fd3b7bd605d8fed445e3a26fcebc00796c0fa3de2806f":{"type":"monthly","days":30},"d2bc9e9d2f75014f708bbfb4b8d28e307e35a0295e715c40f32e1362fc5525b3":{"type":"monthly","days":30},"42aed19af8506f4997e5f47c0a00da1af3b4bd79939337a6d3466a69da39fb60":{"type":"monthly","days":30},"5395187ffc9e1a4fbf6a05840c3cbacf7a2d90c9a2875f80cc32de6217fe2823":{"type":"monthly","days":30},"d3ff685438df3fb7df5c7edc0d65f9beb96b5eacf6a9cbb7cc7ceab9f903e735":{"type":"monthly","days":30},"de610964846133d94f08143c5b17effd1a824bc4098e1cee2d2326e7735ef790":{"type":"monthly","days":30},"308e5db974b5f362baf1e82fc1747d29202041298ed9d125f246bc4e656b8d6a":{"type":"monthly","days":30},"201b0960995b64d4d8d6e266d195badd11ce9f0d980c3125b202851d9ce503e1":{"type":"monthly","days":30},"63f7982b6faadeeeb1f343566b9bfa2102257c066ccf785b1229e2f3a244d936":{"type":"monthly","days":30},"32ae4ce0057ffd8969419ec4dea29fafa83200c84b15e76e3a9811c114d11d17":{"type":"monthly","days":30},"703b81421a615232274362591b11a538ab0c79a6cfffaf715c581d13c6eb52ec":{"type":"monthly","days":30},"cd85aa960fb28a89c89ebdffa35491a02dae842299cc7615df360d15944ca26a":{"type":"monthly","days":30},"24fd2b1bba12b7ca52c2794bd9ae57ce5e6744fb8abba06b51817f1465770fca":{"type":"monthly","days":30},"a99d210ab65abc25ad723379f25337c9ec64739a063d8a3301986d145f7b2c5d":{"type":"monthly","days":30},"63d81fa10a61a353ce680323425db30a96ce9eb23c18dfde588399897f0fd825":{"type":"monthly","days":30},"a7f1c3a2cbcc934b655e19f8c0e61dde2cc2c92a968935eaaa8a09b456f682df":{"type":"monthly","days":30},"056c1ff57eb6ac080c3a4adbad4cceaa51589868320bba390869d1c19c89b27c":{"type":"monthly","days":30},"4b38d011d3654d9b26ed6ffb9e4cd994b260e34f55aab1a6491c949a8780c042":{"type":"monthly","days":30},"c0a1179e3a22cf51a505d742a0116012a8d2092b259ed3e605b8e4e4f4f206e4":{"type":"monthly","days":30},"fb35c016a808e30d412fe801a9b8affe49b2df260c8b2a1e13535c8476b4c559":{"type":"monthly","days":30},"60437d42b5edef823d28c5a0eb42bbca33d81f2f873ee20d1b73e067425fefd5":{"type":"monthly","days":30},"1142fd1ec687d18fb0406a07a6f8dda13a33deb557f5af06b7a6a6ce774582b1":{"type":"monthly","days":30},"4cd19b3235d5a4e1fb35d1f9ba67529363f12304c15b32fa2bf099cc2881ed18":{"type":"monthly","days":30},"4fb5d0a83b38a36f8021b23577f4f3073a71ec66d76d4b3c03e43ae8f21285a4":{"type":"monthly","days":30},"e314fb1d1c9cb924e5e2c1b0e5eabc89f0fb2aa166e2e199c23c5cd049769d23":{"type":"monthly","days":30},"565fae3d15e2b422326b48c098c2a7308ed33dfe38cc8759ebc7431e3e85107c":{"type":"monthly","days":30},"5b9ff76b1559c94bad0528b20769bce0f2894dabfc12797fe58f3e569529addf":{"type":"monthly","days":30},"b356545cdfbefc93559696a07035d01c139302e81afbdbe696168b4024300270":{"type":"monthly","days":30},"18ec0b5cb91a0373d0be721d5731143e4a02e1115bcf5714b360e1abf0563c35":{"type":"monthly","days":30},"7e03185b9e35b461440ffdc1292d21e5f775872bf582a9e0c55e078de1c8c9d1":{"type":"monthly","days":30},"e5b7899f9999e2dcc69f620a2756ceccd46502ef05ebb25bb3a01c35145d8a0f":{"type":"monthly","days":30},"11263ef448c3b0b7613dbb3c383732a819be19838484bcdb374a6988b4fa2b73":{"type":"monthly","days":30},"1887ee117f19f589c53a1a6272d2d161dad1cbaad18c2ae008d3a82cf7948ca9":{"type":"monthly","days":30},"53f8998ff2e3ef92ddd7201b700b95622d717ba61e0e292113be3d24fff04d63":{"type":"monthly","days":30},"fd5ec8b183d9ed845da78f48c36ba7af076430e0562c7623a6e012e5103fa01d":{"type":"monthly","days":30},"542ed3bbf0fb22badd58379aafe9f11b1db06baa47c2e5bd355b443953430a72":{"type":"monthly","days":30},"55375faf931496d5384249c1d2819971102f15bcc85a1aa4551a93a11c58216c":{"type":"monthly","days":30},"78fa7ce892e08d70c2026c18283c8b834311094474ef18a6ad88724b08d7cf37":{"type":"monthly","days":30},"e0554c4628f0d83e469b1e7a4dd70f54401ef8f2be5be3c2c666190d5f68666d":{"type":"monthly","days":30},"00653ad664a8272755f0f863d2f0da765f0413c0667b34f080d4e5aa7a88d454":{"type":"monthly","days":30},"adb8aab627b0205a2d623bdf20c9b6504e931c9d66b0dac7bacd0a6ff5aa2e38":{"type":"monthly","days":30},"9f210f2ba268da155876c7cd61e3876d21330eb75a6744538473ec442b89694a":{"type":"monthly","days":30},"c9954b81fe0a8ccd8946d9138c493b2e92decb364459ea275ddf848b17e6cba8":{"type":"monthly","days":30},"a92eaffcfdf0caa33828a41e9c89114c11d25355f000732633d2e365416e4a2c":{"type":"monthly","days":30},"4b4fba17f18ca83aa094d17464a4c38ae71efbf9fa63b7be9df7871093e1dc3f":{"type":"monthly","days":30},"771bf61cce148fc8613713b471ff63e8c9718fdb1b2537c70eb34338dc86c53d":{"type":"monthly","days":30},"e20f9602e82dfb77dfc44680d3a12003b65ad0f012d3e4d2c91cae4eac69a295":{"type":"monthly","days":30},"45e7484613f65371f7c1b1cdb9d3d01377ec2cfc4e15ce819cfeb09ca89c64e3":{"type":"monthly","days":30},"6a6d39b698c2033b7f31aa5a235ffcea9d13cd375270fc2e29ad98f21246d111":{"type":"monthly","days":30},"432f701de37157cc75a09095f85b130ab38d099fedbad6ed8f9af5b614876396":{"type":"monthly","days":30},"6f01122a5311cdd475792d8024eb7bb0a078dc2350fd355a73c9c537f62d55a1":{"type":"monthly","days":30},"3f0b57bd8307494bad5bab444be6f1329e29de8d9b2f47fcaeaaa9d6cfe59853":{"type":"monthly","days":30},"e911c615b220452c86e28a7c9d919dc4efb6dc0008bee99d0207c5a26ff6dc00":{"type":"monthly","days":30},"42f9749a77753ef3dd48f4ee540a8efebe121a5e0df2ddbaa2600d34ca9fafc1":{"type":"monthly","days":30},"275e4acca6bc7b021b4893649e0afeb6d7817ae6c07ccba4ddc57497b07cf853":{"type":"monthly","days":30},"07e443003a3d8171445855e89530d945cd6473a4b613633becd74410b2c6a0e2":{"type":"monthly","days":30},"b698297561d60b52ba95333d11c694f096948c9c885fce821fa4c1fe3ae3e8c1":{"type":"monthly","days":30},"aca6c142504380f8b06532cd4476e4fc676ddd0f7aba10715ece8f0ac7de05cd":{"type":"monthly","days":30},"b2f3254cddec1be97f9298a9ae951835dbeca0804e0eb64afc7cfcf70e8fe3e5":{"type":"monthly","days":30},"4c8572dfa258ac2c9b3844f1e9d66aaa61448f0418b0f738cdd342df118e10e6":{"type":"monthly","days":30},"b44e645a54e1706a52edea4204aede58f9a706775f3bd3541601a88d415295ba":{"type":"monthly","days":30},"1cc0db4cf0af6926d21a340d80ec98fe4635e8af374d144d860a7f42f468efe2":{"type":"monthly","days":30},"90751b92b2db5c917fbb8cc38c7ad64cd6e65d7159924503ceb5c873892d7663":{"type":"monthly","days":30},"6f3944f704892aa98cc073c6339fbb3c77b782fc8a5bdc6c12c33eb9e7a79579":{"type":"monthly","days":30},"7da50cb0ae90f792602ac7690451c8521eb0235878e9febc9c6e525fc95a30f2":{"type":"monthly","days":30},"3f65c90ba88b61a72122b283d0632efd8e39f317b7e3a0d2d2f34b76a77c40dc":{"type":"monthly","days":30},"5dcc83ed367ce61b79d376bec77bbc9365638b218d6fdcbfb253dcc4f71a667f":{"type":"monthly","days":30},"d8a605c91c12ae677417c1dd8c2ba35511bcca08737df295de4b0b283e8e2a17":{"type":"monthly","days":30},"2b9e7011e91a61083d0efe916edeefe26b0b54565ce9d3989edfac3105699867":{"type":"monthly","days":30},"bfc0b432288b9af107329bb958f9d3f7513cf1ecd43ecf8d4e229d55f2c8253e":{"type":"monthly","days":30},"41e43f3cc873fa213029654abc1efeb45114dc3dd7ee1496b6570ed8817d5ac0":{"type":"monthly","days":30},"721cfd9c0ceda53f101024d7d9416428a6a037d0ae60a3cd26ef34dccd1d217c":{"type":"monthly","days":30},"90eba05e222a154e6b92c52e8b88f7660fb46978ca0a0024a37137706146c986":{"type":"monthly","days":30},"d7a2b1b04c84b713d8761811078e0ef2deb470b71e50abf9a333604ddea13b01":{"type":"monthly","days":30},"6d439df6429a5dd2e7faec2d4fed8f03eb99a908fe8d00367b407b68f63f9594":{"type":"monthly","days":30},"85b1d8ac910d4b68bfc5a23331024458adc33e89972942f7a1d065fd88e90b6f":{"type":"monthly","days":30},"e2e1012d679ca4ce57a469c3a9428f2bf1ca6cd36684d94d568686375ace1544":{"type":"monthly","days":30},"f0933149ffd59e23a0c131192ddebd142cf058afb5fbe5826bac157f3d4fef5b":{"type":"monthly","days":30},"ab40d91cf2bbdb6f4470683d850ccfbf081e8aaca706905a958ce6e91de8edaa":{"type":"monthly","days":30},"66e99d939e8ef0eff1628bee466438d9740dea53f8b5222a17d034b36c06a27d":{"type":"monthly","days":30},"1e81ec47eecfb9f42ebb456ba676511f2b0691c784103dcbc308fc0acc84bc3b":{"type":"monthly","days":30},"1f57f42453f88185b75a4d12b0baf6666a294f441fb354a5b0a0a65cdf691183":{"type":"monthly","days":30},"f8923f4290b6edc524c7c04ccd6a5532552b2778ff9207e456e8d2378c3cc3ca":{"type":"monthly","days":30},"3304123678289ca036c3f891359cfb39ea062abdb79f2af4a7b3ad97da75fbd2":{"type":"monthly","days":30},"a7a3c673829aecc40c1f127feda38cc5e325fc5044cecf46fb197a80e901fd58":{"type":"monthly","days":30},"11edf23e015d565760f28d5ddd7497558d792bbb92644fbfd6d4f505a7a55e5c":{"type":"monthly","days":30},"3dfb1e0e779dedbadaa564b1e13fb04a0a80e12a592a12380872806d020d1e78":{"type":"monthly","days":30},"44b319c841404d983a032806945652b03b1543f7cb703076f324058d2572bc31":{"type":"monthly","days":30},"061c0f31bcf54057bfbd883714028a7e24e9ac0561f20a745adacf51ac80508b":{"type":"monthly","days":30},"502b40fddb869d0f84c415578e1b05b32cea54b12b95fd33df8f03b511d49592":{"type":"monthly","days":30},"a24232c2d0700decd423fe1da9d3b95502c5c703772847c3c147000944c91ab2":{"type":"monthly","days":30},"be67c42e5aa489a4b616a46aae6559a645a3b2a167ca4cc16b440969ceffe8e2":{"type":"monthly","days":30},"11d13ae961d1dc4d7cc4bebbe5e24b0547859d616320413c36175ddce45b0298":{"type":"monthly","days":30},"864e41c24f4f1139c0a0c181cdfa9a12870a5e79fad3bbdda5d43f5aae5d8186":{"type":"monthly","days":30},"1bbd7c8ee077c60006407ea511dbe7a8f683a5ee479e54c73c25abea4598e660":{"type":"monthly","days":30},"c92792c5776ec9a94f3e3d7c43bf51221d303ea424d57cb56427bdb4b4fe9d04":{"type":"monthly","days":30},"46f1785173e69b78ddea2c6858bf0da9bac6d18a1b5d57b32e3865b5841ce91b":{"type":"monthly","days":30},"91b70ac558bde950a0484d79b7ed6033bb4b7399111eea9d90267c4c01307488":{"type":"monthly","days":30},"843bb8d3abd5354bb198707093cc06beeef8d79441faaa1e00f2b981b8c04e30":{"type":"monthly","days":30},"559166aea64dc66589da03371460d957ad592941b57a38e011260813496421b9":{"type":"monthly","days":30},"4c003769ccacb69109338742266bafaf83ed20118bd0c231361b57ca4feb4ca1":{"type":"monthly","days":30},"9f4b14efd6b2ed5b2788a5554ce19d54d7d8592fecde2f772ded2b7864978d91":{"type":"monthly","days":30},"4f18425f28a23637b33f7c5652bdbf741eff478c9da68dd7862714e85f52f5aa":{"type":"monthly","days":30},"db2224ea1a731a8ed905415f7b6e6cb6b64d4d8955e7f385d638de2bc952c3d1":{"type":"monthly","days":30},"b4b301f778c578f6cab95f585c9dba7e7b920574a8c8d467f42fde8ebd2aee04":{"type":"monthly","days":30},"5f52dedcfee31e38c74c86fac87fe325818ed399a0cfbb73715bdc41aa816b39":{"type":"monthly","days":30},"543b1d7f09bb98a236c4581e8364cd395048137212bd9fc018872494abf1ba74":{"type":"monthly","days":30},"8f1faca2b5139717d2107d3f552684005498c02dcf30d759f6dee4051063f1fd":{"type":"monthly","days":30},"cef104b23568cee334c9c68515333c3955f15fc90b4006e61ecb310c662dd7db":{"type":"monthly","days":30},"94413a88b723ffb6ef682b511e6c640218b7f279289042231539b2d3a00fd881":{"type":"monthly","days":30},"2197348cf17c82b75575e1b4acc821c7c464e74c5eed63a2ddb34055334b6bf2":{"type":"monthly","days":30},"051ea4ef167829b604c37fc586af521f6126e6cee75e1a087abe19d5b4c2b579":{"type":"monthly","days":30},"6f41033872658ef144f461b603062f6be9feddb495a0e33197eee356106081b3":{"type":"monthly","days":30},"3546db9c327628b1e2e7935ac6dbeec00decce9ccbd8d2acc51153ae0b2f8f8e":{"type":"monthly","days":30},"ae20c32c8526eaa16341cc1ac3906c52cb1bc84f1d194ac74b83a2e6c801bab5":{"type":"monthly","days":30},"752b158c148d0da24516b6cdd7312b1af0076cf1c372a44ce9084f90675a3831":{"type":"monthly","days":30},"07e38ce7ab8a55f95ea874d798545c5334da19f3ca5c2ff3489e02e2773775aa":{"type":"lifetime","days":-1},"b4ab20e575a93843c74df08624638fb383173b762742848b5eb1d483c387568c":{"type":"lifetime","days":-1},"6e38303f73c8c2303b9c046a7b207be84717d9fb321a0a26f871325e37a3a618":{"type":"lifetime","days":-1},"378c44d814b889d16c5c0991f27c91fec9ddebcfb5aa1fcda015f3a3394e7063":{"type":"lifetime","days":-1},"32e19bef193fcc56f35911ac2c2e807bbdaa9e60566ba4ec290d6328754748fa":{"type":"lifetime","days":-1},"0b8bcb9b2337e11e3f57820dcd10ff57bb70ed1a577b92024da2fc7d70fe0a34":{"type":"lifetime","days":-1},"1b0f21eedefd1423911d81fe20c9b973786de8464e17cae54e41e65a1d0af69c":{"type":"lifetime","days":-1},"f91a10fafcc5ec8ce42d182b977a25334e190f88dd26331ee9d65990a4a70f67":{"type":"lifetime","days":-1},"91361a59360bac64ff185a6bc145694bace7cf9292c8cd48f47d2a77651d98b6":{"type":"lifetime","days":-1},"b40bf984230d9506f7187e555d294a21ae53e87d58445f5bfbb8a1954eaca520":{"type":"lifetime","days":-1},"7d0c50b050210295d0194256e5f4f2c4a818b72b48d642566817537df8e92dbd":{"type":"lifetime","days":-1},"5824578347908536bc930b961beba52c779a4366816328d1ec507f59c446da71":{"type":"lifetime","days":-1},"992a4b2f7702960997abc0590dc1d04a9f5d69934bd422f559fe661fdc40159e":{"type":"lifetime","days":-1},"c647d294caeb3e227983ebcb6d30ac0e807caf96f34626275e38a2587984bb8c":{"type":"lifetime","days":-1},"a50f4990e935f90094a0b3d368853be773065fb87e98bd171ea7c8cd471309f6":{"type":"lifetime","days":-1},"4ea74284401dc952c41e9e9dd643b6a321fcccc254845433468913e1a359d60b":{"type":"lifetime","days":-1},"2befbd82c0a9b42e11f30642e651b8609c021cd66d70a7820271e1b10df5667f":{"type":"lifetime","days":-1},"eed741ad50bb475e7e51570fa0915e84bd01d397c8920dca04743b8c62141d26":{"type":"lifetime","days":-1},"61f7269aa1c236bf520c98363a60eb0ca53197ad9e59a3f6ad89d38964f839e3":{"type":"lifetime","days":-1},"7735b9cec8bd12398ed49169e4403b7c2c97c338e3aeec989f8ee1c05266dbe9":{"type":"lifetime","days":-1},"e7c4436337fecaaaf61e176ab834c76f472c0d32360e063a1d8a2ab6aa4fa120":{"type":"lifetime","days":-1},"ad9bd3054523aa0a93e1548f3d65c6410e0f87e14b8b83a7f38f7097e32fc3ed":{"type":"lifetime","days":-1},"caad63bb30e1d255c948025f35853b82e200200ec31228a90de910984da16cd5":{"type":"lifetime","days":-1},"46d1160cec1b403d906e396cfb460ca16ff3b958e47628b8287f12c2d07bd526":{"type":"lifetime","days":-1},"a92541cb429e848c7b9b3fae967bba98fc20073d3b180f151342355b76a93a41":{"type":"lifetime","days":-1},"ce3a1973669992e0f0cd0791f8dbb29e0cd5709c95f62d9581d4a3998f508c97":{"type":"lifetime","days":-1},"6f0ba2974741c018e5e56857f188afcbba59144515a1bbf3ef27874760b1edd2":{"type":"lifetime","days":-1},"ba938d1f0ec220280e02ed890755d3baab2899de169599ae4fc90144b90b092f":{"type":"lifetime","days":-1},"ba17b13475e0728d41c4d2ef59150df057e5b173ce419fb34675db20ef2cb5f2":{"type":"lifetime","days":-1},"9ef338d724a2cf5985466ebf6e123293007397f41df0bcf1cae768b7979e538d":{"type":"lifetime","days":-1},"09db354d94002c6416bceb775d8eb1372af4feb25f00999ad3e6cece168629f3":{"type":"lifetime","days":-1},"d484e617127de440904bb4990a96796cd15101ccc1e3c2f5cca097f9f1d5abd3":{"type":"lifetime","days":-1},"92765ed6585ece758577c8b535c5a433f35869751da2b5aaeeb3b91603ae1124":{"type":"lifetime","days":-1},"5bbb9118be6260633cb010392c1be58bc2f8f7c8551acb68ca9ceafb97583fd7":{"type":"lifetime","days":-1},"50c2780790ee3a48a21338da88ed33a61051e513d87f51aa73296af8b5f42ea8":{"type":"lifetime","days":-1},"d36ea98751500d99cf72f5f8bbaadb8a825ddaa1058e4d32a565821528ecc809":{"type":"lifetime","days":-1},"f0ab02fe14869496a3aa71db42797d7ae73a888d8ab671f1919384e65e095e2e":{"type":"lifetime","days":-1},"3ab1c09e612af6e3c7915ed98bda7f180cbcd5117e59a4a3bc46b79ec372d335":{"type":"lifetime","days":-1},"763fe8fa8323acf8eaa34c75b4306cbcd546a7e5dec405f6ac16c5dcd37ae91d":{"type":"lifetime","days":-1},"d0a3caff712c6bb5147dfb535c17ec5866c439217adfa795cc85356cd34a2a3f":{"type":"lifetime","days":-1},"1d116d62bd3c674a76dd073e4fe1cd5f3dcaffb2c34f88bdde163ec6010bb021":{"type":"lifetime","days":-1},"c91e0821a075d8074077eeb804d14647dec652f2f2342785cd06900f9507578d":{"type":"lifetime","days":-1},"31eff4bf07a58befdfa82bcc61622728cb06aceae2200d981dc957efa1bb16ec":{"type":"lifetime","days":-1},"171c363540ae3dcfec7a0e232efa2b4888684b9ee0eb141d8e691110e310cc67":{"type":"lifetime","days":-1},"ae5e6ff61f8adb6db0d704eacb68bd3199f2ae3236c88180495113c29dee094d":{"type":"lifetime","days":-1},"915ad1d79f9695e8d4ebd8a095b711c300e4fc89f9f40a591da4553f2238a5d1":{"type":"lifetime","days":-1},"c34466742fa66b6df964240e41a1c07dc5059b303ec38a45858b190e02b1cec9":{"type":"lifetime","days":-1},"a45e805d7ecdcbbc20b311cb43e76ef0381190a10e110fc24e9bd2af6d4dbdcb":{"type":"lifetime","days":-1},"63578e354db81b1bf639cb94e0c11a0f1fc0eeb6342d27432dfb2d8eca9316f9":{"type":"lifetime","days":-1},"afe797ad910dd0b534f33ef2424b10bd3004dc0b611980e71a295127d2dc0df4":{"type":"lifetime","days":-1},"cdde5cb921e287cd5f6ff6add51de97c7f562b760172e738d233699992bf5a22":{"type":"lifetime","days":-1},"492f730ee0515d3e7cd889716eca4387041f632c5c3737365ff20724b171197e":{"type":"lifetime","days":-1},"bd4fb53c4c5b006bfe16c0cb619879ee12d9138db3e0336a6c4c8168d89c17da":{"type":"lifetime","days":-1},"03ee025f9ab0fd02250c38ae47403d1a1ebe12ce7fc20d3c3be6471814c3fd00":{"type":"lifetime","days":-1},"f47c44f2924c89f56f4beacace3500bd1f9e27166a9e26eb830ab9df82ef9bf2":{"type":"lifetime","days":-1},"f8828d15bfcdf9a2982a1040fb219a6d220f192989c55d7f413e6d517311d010":{"type":"lifetime","days":-1},"075394f1f255bf59afa6c5a2cd708eb1880b4f0410da72fc6bbc5f2474e024b1":{"type":"lifetime","days":-1},"fab7fe4fbacafc409d5d276dbb8604cdc63db9a89028582c423fcb25cf7e427d":{"type":"lifetime","days":-1},"4d31aa409ffe2b65dd6fe523fd00999ea49c734a5503f2422117ed15958b5c11":{"type":"lifetime","days":-1},"faff70b0e7bcbbcf50412a06995fdbda945c8ca0b1d2a54a3d6a7ce07248d431":{"type":"lifetime","days":-1},"fe099d1fd385d2678dc02d5d9a03be9b63096c974802c5ebf7f3e71230cd3ae3":{"type":"lifetime","days":-1},"6c987b59e2946ce8ec89161d36c98e83a35f72e751dd64bfdf931787bcd5d494":{"type":"lifetime","days":-1},"78162eea21e85a45ebc785b99259db53cf681eec56ebee0d0d1862dac3759b73":{"type":"lifetime","days":-1},"1591c8bdee6baa5b0b4720e31a46ebe55207ee23a300a4eea0d4fca6dbde86a2":{"type":"lifetime","days":-1},"80b06cba2db2cc1479816621b6f031b350e9b2397efc5c68d33a2df05f8c64e8":{"type":"lifetime","days":-1},"2a5aa004e054828c6c1795af10753d46a7faa9cce8d8a433f39622dd780648cf":{"type":"lifetime","days":-1},"1aed9d4bf9fac4ce1f43b6ea5bcd5cc6159ec1c37d778eadd5c3f4864631dfbc":{"type":"lifetime","days":-1},"e2ad0c22cbd4a0662cf2d7f48c13c2c30d5cc9a2173752ef245ca4820ab73283":{"type":"lifetime","days":-1},"1ed9d15cd9eac148dcd557a2c20c2d4c03c9ed37804e628b304a9aeac135f398":{"type":"lifetime","days":-1},"40ab21cdc0078313320d08242e73141b8135c2fdb8f74da18fb6bc7fa56e7712":{"type":"lifetime","days":-1},"ec4349ced55983b18ff94efefe01dedc9c1ebcb2099536ed6338a7d400ffb904":{"type":"lifetime","days":-1},"2504337e065e67e8d1ea0fc1d0960130a50bf726d122ba6f8ad2af88e605d283":{"type":"lifetime","days":-1},"a112681de917735ea1c510726851efeadc8f4284f95caec6fcaddaf6796760ae":{"type":"lifetime","days":-1},"97c319a6958071732917a33814229725e38310776304a2224723264a9a73fde9":{"type":"lifetime","days":-1},"a21dd6c0e3da2cf83711d906eeb107484fdfbb3fbdcb96321b436d6a823ff256":{"type":"lifetime","days":-1},"2149399cf284e437b8e88b0fdeeeab8c593371c4525da436518f193415d7cb6a":{"type":"lifetime","days":-1},"b420f9a57f2aa77454f7e0fc6f46e88d46b9e98a0be61c4c574e8637c42930d8":{"type":"lifetime","days":-1},"717612473c20fe8063834c545fd695a91f7fa2af2b60105fd69d5eb2cf75709b":{"type":"lifetime","days":-1},"c657cae4888700c0fb38c22e257e08a01368fdbb681f438e4b47f00e7cb5d9bc":{"type":"lifetime","days":-1},"29d2edde8671cdfb174f14dc92f58b5bad11416e362a7d91a54a1081cba3b809":{"type":"lifetime","days":-1},"b6bad820d2e6ce14c4a08179ff5a7bae14d8b97ae3e74b40248b37be0e82f244":{"type":"lifetime","days":-1},"10cc8c780e9f5346592045748ae322f4e3550e44aea3cc25f7e95863147d7a02":{"type":"lifetime","days":-1},"c3b8dc48ad494212f80e6d509f4f03dc06268c2b91ea580fb7881676af365c5a":{"type":"lifetime","days":-1},"5abb85d1fae8a1d0f79d5fc98393530c8ad6d69210173845492e01aa45a1f46e":{"type":"lifetime","days":-1},"5471b707d0e00ab6a0200f97870bad1f290fbbfbd82371e6f80508e3bb891d1b":{"type":"lifetime","days":-1},"e99c0fb6e5a36eb1e04adf454e9634b7b4d50ad5fcd2da16461d6fc52a8700da":{"type":"lifetime","days":-1},"4fea41d4f6d23d7d18e5e08e9d943008ddbed205901622e58016f720dfec6399":{"type":"lifetime","days":-1},"b580bd582f4622cc5e52f7726e8398f9c080987b257c5c3dbf8abe4356828bc2":{"type":"lifetime","days":-1},"6a48703f2c2fb7b1c6e87580d6fecbaa2e0e836f42319eae14f8fee6e137defe":{"type":"lifetime","days":-1},"459b7efa71c63e78c6440848604b72a4348e8eaf62e950b31319bafe18204d73":{"type":"lifetime","days":-1},"1d72993498b9a6c2c6af7f4e48c91f0d10a53ef010714efb36245c901b0b32bb":{"type":"lifetime","days":-1},"f10913aef720a8399b495a766bd01c8bea43276db6ce8d11b96cb3ec8ae3bab1":{"type":"lifetime","days":-1},"e537bd41af480b851fec71e3a1c63452ce2c0e2b30a0987e414576d73c7c5643":{"type":"lifetime","days":-1},"36f7a8ca01f9ff44957556cceb77a2d0f833f7e6f21d4260b5df064cb0ce1292":{"type":"lifetime","days":-1},"bb8ec4fc82770db1e8d686c53f14cab193d1fda85d2377a509fd6f873a9460eb":{"type":"lifetime","days":-1},"eb229a951bae939e30eac6aa975a4a3916b0df15e7c8ff86fd133085454d03b4":{"type":"lifetime","days":-1},"c4e1898bd1b48401e9d173adddf24aa223969ca6de530c52de3559653af83b96":{"type":"lifetime","days":-1},"136d003a01578af990b3b679e156fac06be9679c3b545023a1eb911611079800":{"type":"lifetime","days":-1},"dc10a38ecd401262939de5d94437700f55b05b720e56b97c9e29da2cfe4a54db":{"type":"lifetime","days":-1},"d2c86d3b760a8e18f3f4a18a6e976375fc525beaae5fc1275f36e89c62cf5ae9":{"type":"lifetime","days":-1},"84334d7d93379ba77e4a0ecccb35f776c48746e554cf95c3fbb245992f425d48":{"type":"lifetime","days":-1},"fe2e953e3d440ad1df52493acf7c9553e3bf3585ce65fa6c614c674bbbced33b":{"type":"lifetime","days":-1},"6ec1bff6c1a16d7dd47409396d5c270f8dcd7af31528bf6bfff1033a7f905b41":{"type":"lifetime","days":-1},"0626808d33948bb76a3e444b2d87afe799446ca81395299341ba6026890fba56":{"type":"lifetime","days":-1},"bfc0f6e880e66bd98990e156dd0833a850293d90ee040306c469d75a909c136c":{"type":"lifetime","days":-1},"3196d42411706f7d53181f6e858a0956834daf70a38a8c42aed17c7efe40ec8c":{"type":"lifetime","days":-1},"f11b990a6e1c29c7070dec927949b3d12fdb77f7d5489c8c042bb2b4013a6226":{"type":"lifetime","days":-1},"30f9b50cd246b723b285f491c0af74a16f7f015b4086b1d56f4cab1318519f28":{"type":"lifetime","days":-1},"b92c068f46dafba6eb72aa0f3d65c7fc8f86876029a6d78d3a6c0651356acb7a":{"type":"lifetime","days":-1},"5f19d26c2d8de1393743783d533e5d7b61728c4090ac1f316f7999aa9e2b391e":{"type":"lifetime","days":-1},"383c87d7ac473c939ec695c9ecfff39ce9f0a5e3482d838952093d8b36ff1aa4":{"type":"lifetime","days":-1},"40099b4c5f96fa3626a9dedad92279e5c41bf0de6426171f2301c4ab095e4016":{"type":"lifetime","days":-1},"dd3aa6ff7fa9c4307a95827a26a2a58f6fa3fc4311b4f2abe2e4fc1eda109f27":{"type":"lifetime","days":-1},"49aa52faad7d251275985695391876ae692c576ddd88be536d5b01f89a7bdc1d":{"type":"lifetime","days":-1},"61ca4a3eef3b659b116dd7fd062498c327363b374547fde750436805f069b96d":{"type":"lifetime","days":-1},"7f2644249d44374ba71e7de03a7517b0fdec98884e1565d77169784c044ced6d":{"type":"lifetime","days":-1},"40956140971772c562d16158b55393493d0ff636ea594b17c66ae755bb342185":{"type":"lifetime","days":-1},"23e998ca8189acadc74c050b79a0e037dada4dbe60aa2f47eb795b974568e87f":{"type":"lifetime","days":-1},"28337773c4e623bd715677fbd3098684e13e6c475d0a59e45276534ab54b0830":{"type":"lifetime","days":-1},"b765ece76371030ddce447bb928f165eac24d03180423ef8657702fc14665ad0":{"type":"lifetime","days":-1},"9f5bf4b194d196afc7d73fb134f4a128f9080ebc4225512c684834556acc632c":{"type":"lifetime","days":-1},"43818d9a8fd726d6200612018747c33d27f885d116d4786a2247cce16856e18d":{"type":"lifetime","days":-1},"9bf7be6d74a401d39681a2615478c8b48c65d8d57d68a9bb8b6ce23457c5b38d":{"type":"lifetime","days":-1},"1e5aa4012134c48e46a15945ccab3911aa4a75753540fe12726d8e09ef012ac1":{"type":"lifetime","days":-1},"506c5e1f1763fb977a2533c609a91e857108a67160daa26f095555f837521d86":{"type":"lifetime","days":-1},"72bbf3581c462068166aac9b2ffb59fab0740da3f1a136b44d88b203119084bc":{"type":"lifetime","days":-1},"f8c7444ac7b772292c8cac659d7d6053a91a7c6f3bb106790001f8f5baa89f40":{"type":"lifetime","days":-1},"487f81675012b0e144a3b7601edb7c9253fa434d153fc6a56c6af53d7851ccb2":{"type":"lifetime","days":-1},"ec10fb54194896fc1f54725a25fe44a43dceced7ceae828de4a5b3a936a0c7a3":{"type":"lifetime","days":-1},"cd080d1ce652fc1d20bcdfd902dc8f73763cc446b8d2a94cf6f297d297e381de":{"type":"lifetime","days":-1},"db1269214527edd9c63224a15b279f04b7b912937fe00532d07e1d73ca5326dd":{"type":"lifetime","days":-1},"558490ec9547da06530219503aef3c65ffcfc8452327e911d5299cd06d6b3e94":{"type":"lifetime","days":-1},"bd68568dd105f7b8224c401112b739255c0661994f9fb3ff94d4d241e60547ab":{"type":"lifetime","days":-1},"6c91a44721d5f403539bef100c0ed41efd9c72c1597503c2f4905efc76b964b2":{"type":"lifetime","days":-1},"d3b47c5c0ca5b4184a58396e0d9dcbcc1193a9ee12b65410a4af6f434105eb45":{"type":"lifetime","days":-1},"ea484ae12e60a46a90b28d5c296a583d8f3ff7dee257408578a8ab0f48af7dac":{"type":"lifetime","days":-1},"7756424e863349825d0579fd7470b72aa52c4d85d7316fc82a6b97c288cc7829":{"type":"lifetime","days":-1},"94e46233335182ac4aeb4126652396bb996fcf84f343b4cc3c58978b4a37ddf6":{"type":"lifetime","days":-1},"5647a5455c90d27c26c53e194dbc1cc6c864c64d28db3a1a658b96d29aab2629":{"type":"lifetime","days":-1},"399fc224bc42e8c72617f5885cbcbbb2e72afac3e85232238d80a021ea22f862":{"type":"lifetime","days":-1},"0b44b4a1349fa71803c2abaa35551800862d3c8b41e234ca246dd343902b3bbd":{"type":"lifetime","days":-1},"2f8ef7aad85b39fedca410544171538142ebd71905e27f299132d4fc1e71d926":{"type":"lifetime","days":-1},"bcbc8d3ece1ea49a592a445cb835f6b75e8fcf62c5d07569d307e9151f2160e3":{"type":"lifetime","days":-1},"0081a27378b9a01cd439aa19ce7e2c04c253199b0dd00f24fd9e862db9182463":{"type":"lifetime","days":-1},"eda8ef621e961c30e447870fa80cfddb527bc4749b11f25c689ca626646d7ec4":{"type":"lifetime","days":-1},"5e6fe81b5d11bda0e299a4e8fd35c58656414322241be522eb6c2159f5a3f4fd":{"type":"lifetime","days":-1},"9305b1c99db90cf8febee090dcefcb657046d0c619b5c3e8cbd032a70870961a":{"type":"lifetime","days":-1},"98beafbbd56c337174e773ab28f4c41559fa60034f4f71dd4eecbbcf5307d917":{"type":"lifetime","days":-1},"4f1372f09ca9e3aba54c9770265eb9d2ed727eb35e38d0951c49c4b286d37f10":{"type":"lifetime","days":-1},"f8038fa6a3d626c20ed16c8d1779e5a97d71fb82d4da018788530690152801eb":{"type":"lifetime","days":-1},"a15801fc43bc70c1a7105800bf23fd5c7126253bd92c39039a11a381083f3ac7":{"type":"lifetime","days":-1},"fd80fe861bdfbcc47828aad966f39c268b73c71be00df249f58d5812d57c1bc6":{"type":"lifetime","days":-1},"d6d8991b3752a189fdb4793a7e0bf39af5a6657583accf9cf4bebf3b914d1b94":{"type":"lifetime","days":-1},"02457da2ad7fe92d893c9e25052bbecaa1cf99882acb8b39a6377c959248156f":{"type":"lifetime","days":-1},"502364db20ef0c3dd502ca95a559bef727e64b903ad1514a7862c5f6eaf1f481":{"type":"lifetime","days":-1},"79ff037484632764e85be31afc2ab9fa58230e83bfb155bce1b270b867cbe100":{"type":"lifetime","days":-1},"ef4cc36f9647049193e07bed9738197a2c778581e680776b76163de134b0bde0":{"type":"lifetime","days":-1},"8976825899ae99ab8a270866d4b08730af161f5f973e29d6a6df654b3f963090":{"type":"lifetime","days":-1},"acee1b5d265a704c47a74b6c19998a93bac095d8f90a407a1f2ca85fa885be3d":{"type":"lifetime","days":-1},"c953eada649e408747b0c2702315203babf96d98929e67acbe52d4543af71748":{"type":"lifetime","days":-1},"acd1003d41231b5356ecb0cc11906a1a41f524947d5c0e17b0970517dc2fba21":{"type":"lifetime","days":-1},"27b671fb13d0e70f322648c7f1e111dba4b6f5f656bf9c61158dd0470dcec10d":{"type":"lifetime","days":-1},"45a0b38339630269250e273be3656c68dd02a47fb86bf36bc72084b82e284a7d":{"type":"lifetime","days":-1},"4146630b1b748132773d90018f60ee855119587fecfae053f9b9c964fa0b3af8":{"type":"lifetime","days":-1},"ab2ac9bfa8fdd25309d50fd5519b4be2357cde9b26cf4b554620b00de513775c":{"type":"lifetime","days":-1},"9fc9005d5b7cf6d7e09ff0522c7e20607b2ea758282fe7c17fc1caf8225d7bf1":{"type":"lifetime","days":-1},"ad054ec1476509c86c193cce291b220e38f73927890e745cdefe0ae8cc4cca96":{"type":"lifetime","days":-1},"deec1dfc2af5d865e9462336ff749d2df9d9d5d0cd7b93cb87b040b49ead1066":{"type":"lifetime","days":-1},"58fa8f9f1bdb2ef618a30b4b78846d8b36f4a71332edef517c3f6ee757ed5b91":{"type":"lifetime","days":-1},"ff5155d1ab046a0281e925df896e31b777ba38627a6eb0f6bca7c3ba7462f5d3":{"type":"lifetime","days":-1},"319a992f416e5351007e4d5199ba4651420273c057d1d51976e5a1b1bbd9f4f8":{"type":"lifetime","days":-1},"e0c8227daf16573fb396c961865867d91ffbfaa946b53a63a05154f29d8a9109":{"type":"lifetime","days":-1},"9436b3dfc915dc6144faec3749d5fe41882644d851b0234b24a1d99dc1ed42eb":{"type":"lifetime","days":-1},"21fc9b504f38b37b7f6d7f869205026ba84771d1e98d399b6a973885ff1dcd27":{"type":"lifetime","days":-1},"7248269d572dd560945889e0b250e0c0dcca7d31f9039484eee9fe434703dcce":{"type":"lifetime","days":-1},"c494a64de86fb4a979cf8406a363e5a5f5d9ff9cb55f7cb8ce98e4b3f3d87189":{"type":"lifetime","days":-1},"9ca0813745ff3e86f3722324e4ad8491450c14961903b1666e5feaa296bcaf4a":{"type":"lifetime","days":-1},"ec7e1bd9e13235c072175fb9c6360e092cc335574ac0bea5b06219daaf822b3a":{"type":"lifetime","days":-1},"8c18fb0b0080501c6c2e6cabf3618d3e63372d2ef01caab533c464c3f434a7d8":{"type":"lifetime","days":-1},"162df783c08894dab6fd6d500ffb4b95358fbbdff257fcd69219b63aaefbf294":{"type":"lifetime","days":-1},"06b80a8cde1397af7524df1ed83cd672fd23b1351aef3cc46df42130d7f66c73":{"type":"lifetime","days":-1},"afb15b9c3ac9149bdfd322a9b14d2f0da5eaeb98d8b9d6ada6072accd4a7b89d":{"type":"lifetime","days":-1},"dfa4987f2370608894dc42e8f2cbddaab57f98e5b235cfddd150454b59ef3949":{"type":"lifetime","days":-1},"4919bc41432adbcbd4eef37db426d680d1ef10c5b30addff7594da1f4148cb75":{"type":"lifetime","days":-1},"642dc27a4343744d5b0201df94a5b6270a89d4023d6dcff98eba02d14f0de9dc":{"type":"lifetime","days":-1},"9891c3f5567a47be2fae6f1c324ca0d9141c62cfabf2ec3a59423828501b3a5e":{"type":"lifetime","days":-1},"a5ecb331a663eb333510bfe6ee861d0b52c6bb348c46ef1dd366d81d37ac67fa":{"type":"lifetime","days":-1},"e1c9a565218a5024a504c8513c0bcbf07ba654a9adee1c0772e3a5c4e34eed94":{"type":"lifetime","days":-1},"d09cff91d7b21693cdd7b3e627d2b69064913ce41e8d78bff9239fd65051cf5a":{"type":"lifetime","days":-1},"15f010a195c178b9d4779750d274ea15827fb3aec90cb6b3c0a33d07f3023879":{"type":"lifetime","days":-1},"c4bc529f4a185d26d234d1271c0b1447d836f368ec3c37cc17b73d8f8e80d9dc":{"type":"lifetime","days":-1},"60d8a52c69b35100ffd4e94b1cc351eed049a4c69a7a317f4598246e97518c2a":{"type":"lifetime","days":-1},"b4404e165c0eae5823589d94228a276413543364cffd7ada4ea28f4837ca80f0":{"type":"lifetime","days":-1},"3a2b05acf6f23903520ca8993053b8b31481362dd3cadad8755ebc6de92289a3":{"type":"lifetime","days":-1},"4b2628b84c29ab7d38a4c2a7d8bb828213012345194e1ba7c746f5099d1c1530":{"type":"lifetime","days":-1},"caf08ef3b90ffa9c5269b368c410813e4c6e8b5655b14f0ab571fcb1b1bf0aff":{"type":"lifetime","days":-1},"d0c9a7e0bb160ec9564295bee1c0b0a2cfe1a72e261f86f5fe063752c07c0548":{"type":"lifetime","days":-1},"973ac70ba3191f1c3251c904e8432534a1c144698fc448299cc974214ec38773":{"type":"lifetime","days":-1},"abd1742ef683d69aa2ac2209ef3f55e5576820516334e81cebc8b835170b9ccf":{"type":"lifetime","days":-1},"122b255aa09f5491db83e885918ce00575ede855a53d324cfd3fa4fcea444e11":{"type":"lifetime","days":-1},"f7674bc71b589ffd14785fe85ef7a5cf52450f18850f6204cd46ca9b3731171b":{"type":"lifetime","days":-1},"15e5ddd4ba2d0db5510695edfb96ce6fa81eebebb55359b7c1a74582fc0af5be":{"type":"lifetime","days":-1},"398f835da39495688bbc6686680682434cbf3527c2ca1daf761ac3e9f4f87209":{"type":"lifetime","days":-1},"ffdced78331f29e8dd8676f7ba18f0170d4a5117e288045b39591326221e03a9":{"type":"lifetime","days":-1},"b2c8275eb9107895ff1b10347554fb93d7e446e8885c83e8d85594bed75a78d6":{"type":"lifetime","days":-1},"de9ebf9a6931d79eb7b4eb8a547e5b92f152533729e04e85966d672aefea24f5":{"type":"lifetime","days":-1},"618a46e97a3b9ce5879f03b6b34b498b40173e772880dd93033cb894491eca33":{"type":"lifetime","days":-1},"71b0d028bed951f780069a44366cd5c8bb281025576fde249d6b66f759556e14":{"type":"lifetime","days":-1},"2f0231b54724268eef7384d358141b6d138d1fe19298fd7674c2ba246e9babde":{"type":"lifetime","days":-1},"1e3877923964b5b65ee557c25116a899ec0806a05eef2b8bf13fc9763fb7a99d":{"type":"lifetime","days":-1},"7f539631eff9b1b8c65521bbcdac5c9005615db3067922943ba9b06ea58e8bfc":{"type":"lifetime","days":-1},"d3074408380408f1cd894b753e65aaa0239c15096d69d105e997abf24a18125f":{"type":"lifetime","days":-1},"d4b5e7a282c5a2651e80b333f34379488f1c033d6ac83fe4c840f02cf2f4e2af":{"type":"lifetime","days":-1},"a9d868416b79117ff0c2b8a7e33d4a3cac205a4ebfa63b287aad8aff88cb0f3c":{"type":"lifetime","days":-1},"edf4374d7003e65dfee8dbae05852e224fe53c0610eec8bdfcaf2968a686cb3d":{"type":"lifetime","days":-1},"79eadb9216010eef6094284367707264f34f5a0d0ff81a9baf4acc4bd1484362":{"type":"lifetime","days":-1},"26237166e0ec0b4e5bf950fa559d44ba7d290ab473dd5013eb22d04c74393912":{"type":"lifetime","days":-1},"b2bd7748c2e7976f6a335a4e81fb9f22858410f95937a04990d5f4790b77c59b":{"type":"lifetime","days":-1},"fbc7baa8032cc36263937d6a6dcf78fbb5c43197be080bfcecea608eb4201e21":{"type":"lifetime","days":-1},"ef1ae9dd72fe9216784545a78e8825dadced4f3a0cca3190c1538f50f230b53c":{"type":"lifetime","days":-1},"9e228716e99879ce0c0715e264820f9a2f09228f0f35be90639fd6c7aca97b68":{"type":"lifetime","days":-1},"696250c5d661a3fd14905a369202cb0eef4adf73a65d6e0909af57f9f35c2ae0":{"type":"lifetime","days":-1},"c88d0eaca9d1f32ce253e3dc46819ef6b0466dd3d98f880a44535accc259acea":{"type":"lifetime","days":-1},"01ece339c0f30b710419756f6b9c7323a27b5ab161c54e17eae4a3cd219ef5e7":{"type":"lifetime","days":-1},"4eef04ee71cb954dd7645fa17a8cdb9e65fd454092f2f6fb6e3e556c5a84906b":{"type":"lifetime","days":-1},"9b25fb7869386509ac747ef91f40c900a1641a2879dcaf13fc3bd7ad77b49d21":{"type":"lifetime","days":-1},"457659c3be33a076e24cbd5b69b4e4381c09ab4a1767e9df41b0c9edc01e6713":{"type":"lifetime","days":-1},"c2d7515fae073aa6403b9ed5cb228cdceebb1c10aadee7ad1ade508bfe3be672":{"type":"lifetime","days":-1},"ec4f1ec433906cc12d25fc46edb835657a7d96b127d35ac71f9ed2e2484ffcb0":{"type":"lifetime","days":-1},"32f039426e2783a62b5c9ad18cdbffec0994bbf0acae073b2e795a2cd646a87b":{"type":"lifetime","days":-1},"9c0f674fedd1f41251638e3ce43c34118a2e7ea7374d4f0f5d68658e8fcaa599":{"type":"lifetime","days":-1},"35caf43620e2034138c7c58f414e8251abb9bd36a8a46b5e9d635dfc6a41dc69":{"type":"lifetime","days":-1},"f08ec45d57105b7b78eecc883044d1b1dd4cfff84c5c9181a101fa1152752ff3":{"type":"lifetime","days":-1},"1289fd0a12fdd20c8ac54ac3d3280792d3a619db6bea745465901e092ea0e5d3":{"type":"lifetime","days":-1},"a318ac7c87a6b3f002c05ebd66f6a31a354d59c3a3f63c11e74617930f3eb0ed":{"type":"lifetime","days":-1},"b12f74503e5256e8f15363ad7c31a2468bb12c708e1fdda0fe292a8491a9cf23":{"type":"lifetime","days":-1},"e58e1f040882cd15ba6aa61a190f6daf1426a1bd61f86ee2bacd8d43f0ac9c52":{"type":"lifetime","days":-1},"a8374ad2d8fbfe41f0576b41ac05660d0dc58fb5dadf68c6a8c3072746def49f":{"type":"lifetime","days":-1},"9ca1bc56733d6eb002bdf7761b5981536467f3bd576962abbd09718916a4b4eb":{"type":"lifetime","days":-1},"e44384fa7b571afeb0afc4724581470ef292b5f2ca6940f56bfabdf6be54d665":{"type":"lifetime","days":-1},"fefd1d77514db0462d0fd6d4ee7e5efe1e47fc058d5637810771a6f486e6ac60":{"type":"lifetime","days":-1},"29b24a2afc4f032d81d248635a412cda8fc29845750f6c0bf4fe55a70af73691":{"type":"lifetime","days":-1},"e8ecafea77be9efbb3d58cc2669c01c19628b014c801ae487e1f8cfb3d4e4aa8":{"type":"lifetime","days":-1},"e592ae66f112172f16c3815c3ad48d0663f39ca340e5d73e95b389b6eb1a24a8":{"type":"lifetime","days":-1},"b12aa2878bfd55e7acbd4f9ab94beaa4716f42cfff1330034ff390979beaccda":{"type":"lifetime","days":-1},"fbd2f2962954c181f49ec229baa3599c0a32ed584665c534df35887e8ac6d886":{"type":"lifetime","days":-1},"eb51fd1c8273c3928b66122059fa3046c8e43ad73e8c3db91f2bf0343c23dc22":{"type":"lifetime","days":-1},"412af482a8d2ddf1c18d64a9e8453dc217f32ea6409bc37bf74e27c1204f5db5":{"type":"lifetime","days":-1},"1712fde8954c3267a25e8d1c8574c799e176bed71963d0adf29107d81c182a42":{"type":"lifetime","days":-1},"71ef07e860f6f96c1412b95b9099c6ac1774e1dd6f2d203dc5c24ea441ea3cc6":{"type":"lifetime","days":-1},"70397edf4b51c82f223b98b923b2d5e5417531b0cdeb2584827c791508410f80":{"type":"lifetime","days":-1},"211dce3b13b53cb6518e2fa020502e17f6882af778f856137f3aa3d494b15c6e":{"type":"lifetime","days":-1},"05727514ee0f5cadb7d84175337e6539a3bf4c631dd1ffb9b31733c35380edeb":{"type":"lifetime","days":-1},"c6e37626bc4ca45575b884552cf7beb3b164b532aa4eeb01e6dd8a82f5b86ee1":{"type":"lifetime","days":-1},"e7c8f0df511e4330676b80d3be415b00a9478852bcaa213968824a95fb700593":{"type":"lifetime","days":-1},"35afd7742a522b9c05db19d93272833bd0c654492fc76a4f079479d2a6c3b6f9":{"type":"lifetime","days":-1},"cfcf9298519228d60cecb307a5b607c6b7fa09a10d8ed31cdde3f098335095d1":{"type":"lifetime","days":-1},"c53707fe24378bac921df8977893d5ad725d8de85bc12b9c31780512b77333d5":{"type":"lifetime","days":-1},"8decb0f7aeffc8cb06cf05a4882ff7f86101ed89b139dbe962638e30550c3166":{"type":"lifetime","days":-1},"34b2257ae9b1302fc96be35faa89b125f10b0454061eb1abcadf21e3d132444a":{"type":"lifetime","days":-1},"2ccf138d0e4ee6c9fe6ff94723eabd68ca9276f20741d9c6a1c72eacd4b4c36d":{"type":"lifetime","days":-1},"2892a0991ec4cf88b26f0c29f53625d76b00ba63bec6bc5cb3ee3c128397ef3a":{"type":"lifetime","days":-1},"a06df78f927a763f23250713aa4f4347802b4b9b66fa48bcc6f58c574f5cace8":{"type":"lifetime","days":-1},"78edb4cd403eeba9392fa9ac6c057eecfbd66488b7af76c0014017c76bd00001":{"type":"lifetime","days":-1},"7b7d7c3c4110e8dd6cebc24bf6588e413694efbe11d5a8b0869c36482ec50846":{"type":"lifetime","days":-1},"df0f743348fa32b319362ca71cf21f435480f6fa61fa0b1c1209476849104923":{"type":"lifetime","days":-1},"587425ff5dbbe61da75f974fb6b32f453ac5aa10607c8a3a3e0fe010d56c1fb9":{"type":"lifetime","days":-1},"3aa467e0244add58a2ca3ae8159f2ab19d2e90cb36f33fecd8ce7b98e03140f2":{"type":"lifetime","days":-1},"f7a057cf5ac382a85de16cea0e7393b96f9e19f90cb6b0ad159719fe383c1a9f":{"type":"lifetime","days":-1},"2791efed22b9bc95095c1af8049f824d0ef594639ee96cc2f4039c369cbe0796":{"type":"lifetime","days":-1},"1cd655b7cdf32ce16aa98f197745484d51928a5c2f635e4d46e99746f6455d27":{"type":"lifetime","days":-1},"7a78433499a9a2732289c4e97d44e62d6a6e8dd0548124c2ad54a394fc4d0ebf":{"type":"lifetime","days":-1},"68e7a7aa9f6541c7f591ab699e24184f810e11d48b0a134c8e16ec22a422f813":{"type":"lifetime","days":-1},"fc5d01503699a4142f6e4f0d6ebb8639139d6581a54578505891616e975a93d2":{"type":"lifetime","days":-1},"46f513845c2fb30e1b830d10c80f32ca5402c264bfd889a4b17a0b0026f934b0":{"type":"lifetime","days":-1},"cd79afb1b6fa6a46f1369fb163df4f4f399e86a99dd7a8fd254239a49bbed19f":{"type":"lifetime","days":-1},"e85313b5583bab0151afedad2641c5518fb118064d4d983fb3ac21611529d6bd":{"type":"lifetime","days":-1},"2f3167576b3df7bdc90dc6daa569fb3b782aeec6a5ff05a673dc92b847a23668":{"type":"lifetime","days":-1},"1297c573df8bd0c8a4247c62ff91115f537cef8270ed694e173aa9e674f48bbe":{"type":"lifetime","days":-1},"fe9c19df8df43c0522f63a7c5d9b16aa59759fbcb36b9e30aa58e9e10dd82ef7":{"type":"lifetime","days":-1},"c1625a2f09b41f7373b8b54a9d0e0726a1a77d5777798bdd6f04fb30ed2a838c":{"type":"lifetime","days":-1},"e3c97fd19267ffebe101599dda0d5655c36f46d21c8b6aee16d10994502cad13":{"type":"lifetime","days":-1},"ca8e0846d7515b03105be931557c002abead96943ff633288d890d8e8e182596":{"type":"lifetime","days":-1},"135ad6ff4ee331f5d9706b173ab81db0a18576593339701dc81e6e01100dfc47":{"type":"lifetime","days":-1},"bf82d00959dd96b04f89a370b7b1ee3b251d04c7514eada952d8de880c3a9c8c":{"type":"lifetime","days":-1},"835d727614d1b96ee10047ea95669446f99b94ed655042bc8909e82df4610a97":{"type":"lifetime","days":-1},"5a2888f3ba8f400d947cc1f359ad55843c7f46f638e67f69242989f316bdcb37":{"type":"lifetime","days":-1},"3baa7aaecbed8a2a2de9a911a95bdfb5e59729688c8ffbec68580d9ad2d6c4a7":{"type":"lifetime","days":-1},"bf1269ece5514da06172283f61e2f51ee4a76fc2f14c3e305b288fce4ade54aa":{"type":"lifetime","days":-1},"5e3d4bb273624edc619dffac7283c08b48949f1eae7b3efc7cb47721b86a4991":{"type":"lifetime","days":-1},"cdfe957946141ba510af05a9a3a0933918399e773206e64b7875877cb7a2b824":{"type":"lifetime","days":-1},"95bacaaf7af55b71ecaeb72539fa267b7e711c3c607f8bb5f855b18e619ab102":{"type":"lifetime","days":-1},"052536a67a57a61f013efa3908c84be01a39c569803974698d391664a6244ca4":{"type":"lifetime","days":-1},"8279f9447ab31a1650c3fa3665426a976307a858824199352fc88e0e43d5bf78":{"type":"lifetime","days":-1},"90824b30157c0685de5e329c99bcb3dfe2bc0de949dbe36b3c8f8a3c143d2aa0":{"type":"lifetime","days":-1},"e6baab899fe8c2a9db22e47d120d03e2abffef6f8eff3a2cb09528b9458ca0d5":{"type":"lifetime","days":-1},"f485d3afdb8678cfb219e51c3cfe8e8f5eecbc06f65e7aa63ffae0802252cb2e":{"type":"lifetime","days":-1},"a3f28434d73bd9feedf65506cb579e11e961dc89df6423d5ea120832a093c361":{"type":"lifetime","days":-1},"574026563fa41b2783ef98c7c5e5f354d86bc2ed2a6891b3decfbcec6779ae06":{"type":"lifetime","days":-1},"9412d0ef8caccbc49ba6dbaac74cf9805ee079f69f1e565873a68f9405a3f20a":{"type":"lifetime","days":-1},"bc4eb011e12548e9d5bdc03cbb7144f38b7294a876f0a5df0ab09b19c0c2dbb9":{"type":"lifetime","days":-1},"a31108651380317aa2f8e04851cdcd5752d0d21f2f4168b84c66f5418926db77":{"type":"lifetime","days":-1},"876ebd6a1e0236b2a448fabb6db0cbca8f5d1594f67c529ee3d34b1f37eca22e":{"type":"lifetime","days":-1},"72a8193080d628fb2516be0f73dc9bcc0fbad9472ab97f1856b2d92a952a22c2":{"type":"lifetime","days":-1},"a9454c23ccd08bc93beaafe86c9cfd0a9db54997956446c0144501c918b12a95":{"type":"lifetime","days":-1},"10e75055a1ebf8d13d1f5d4bd207adbcdd057fc93b4473075aa522a7ad96e8bf":{"type":"lifetime","days":-1},"914d2cd139dc64d0440a894ab30b7091c4e0d3dc4e9a58a965b96746477f6bfd":{"type":"lifetime","days":-1},"ec0799fca3069d4902a5d67472acaa5804974ad4bca631d79d917ee1b355898d":{"type":"lifetime","days":-1},"842a65c2733a556ac2360896742941553dedd2997947139dca273645793dbbb0":{"type":"lifetime","days":-1},"8e65549b25e483e28d8234b5905a78e48362477f74d5b84b0f3d634d58db366a":{"type":"lifetime","days":-1},"c6c907ffc3bc9db49529848067c16f9f43d0d34852579192d6a02a1fc28695a6":{"type":"lifetime","days":-1},"6e7b02a9fdb576b49618185b984078a66f56a99b6e89bbe70c2369f0a416b4ad":{"type":"lifetime","days":-1},"f4bf740e69e0bdb045fde7b68ba16451c6b6e51cdaacefe933a45a4f5a6792cc":{"type":"lifetime","days":-1},"a0527e2310b485c4600306d4c9c4166df6e7baa1a158e668e55a716ef0fdead1":{"type":"lifetime","days":-1},"2637a91a758371f5e5277f94f1800cd461242e03316b0b17101356a4d6ba3531":{"type":"lifetime","days":-1},"6c3ac5b81d6e3ead05a01e3bdc0169640552146b6e6dd5f1c2d406992e5a3834":{"type":"lifetime","days":-1},"8777466cda54ac0c9f42529d6ab4b824f1bd50e0dabee6d9375974477963e4f6":{"type":"lifetime","days":-1},"8a547ace6268d2f0bd14b1e6f6aa96fb95eb6407906390d0333a4f5269855cc7":{"type":"lifetime","days":-1},"16fc25ce1a785ffac040b2b6b389a52228bbf1c624a24112cdce710c078df6b3":{"type":"lifetime","days":-1},"77f0b093848360a7f7ca0c19345634df148fc97bc80ec18cd3f610b1545a19c4":{"type":"lifetime","days":-1},"56beb027fd0e83cf57eb22dd2ef6a1555452d37f24d61c65311029c1e5db0f80":{"type":"lifetime","days":-1},"822775d2522ae32921f35de9e13ab3204778c6ef728bf65948dd2cc8ec50162f":{"type":"lifetime","days":-1},"5d7ff94483cc3e5282c8c2424921e5ceb56c2f47f5af04765f85f49aa76d498a":{"type":"lifetime","days":-1},"788389c7a85701a7384438f36eca4c50861017a8c0f884306e634a63ea8f13b6":{"type":"lifetime","days":-1},"ad05603507f683501e4b9e4ca2e195fb0e6c59d7285b7e97ced1f5ec451c9188":{"type":"lifetime","days":-1},"480c51ea7e1212b71a88a67d0c3f59fe0146a885b35504145b0ddd92b3621c76":{"type":"lifetime","days":-1},"a40ae422a9c10a1146ef266a30125aa0ca42b5673a4872a8eb0818affdc9af44":{"type":"lifetime","days":-1},"526dd8db342ea2fd92e526f9ba8cced755fbb4e4a813080aa9e50c28b93945e6":{"type":"lifetime","days":-1},"44442c01ec7dfb0b845fec1b6d2b556faed895c8445087773bfb95db947185b1":{"type":"lifetime","days":-1},"0cbd7ec3954f704d7f1bb2272ba93553230f8b1341d26e3846117fc9feb45b51":{"type":"lifetime","days":-1},"e0610e73c65a03d57a8051bdb7824911713c9808e35d7c1ad10208ff2e10ce44":{"type":"lifetime","days":-1},"128c4d9620210aa43a7bf75c9862183886dba90c65f7bfabe839c3e33dda41e3":{"type":"lifetime","days":-1},"bde73dffa9191e3f824b2dc5bcea7cc6a96c7a90a99c27e5073cd2fe1191ce30":{"type":"lifetime","days":-1},"1896ec14ba98ef507b7cdaaa5cd6f72e5b396be0d1c8ef1dddcb8d116079510d":{"type":"lifetime","days":-1},"2787d4751e7aa2c09eef2bd63d0b05b7bb1b61cd0aec2cca4dbe1425601cd586":{"type":"lifetime","days":-1},"9f637ffdb0eaf0b125a17800348961026f0afd0da66904a01b8e19876d596de1":{"type":"lifetime","days":-1},"ffbb27cc95beb658b849b16cc5079fd522f1d3e7f33e4e6c7f517b2f6ea2282f":{"type":"lifetime","days":-1},"0a6d892d9428748024bbeab7d58a1a1b6c57382bf34201a7289b075f30003f27":{"type":"lifetime","days":-1},"4bdbca49ebf64c8d7fabb0e951dc6135e73f0fe4ed6c340db958ad0b409d835d":{"type":"lifetime","days":-1},"1f979f1297ae8fb23e9aa26b336eace83ba0cf31ff3c46a2ef71acc9c88242ee":{"type":"lifetime","days":-1},"e68787d2ca090e9b885a79aa417f1646164ae02a3d1758b93e5796edb50cf994":{"type":"lifetime","days":-1},"705abcd28e11cb5c4b8a24bceac23823ee8b363ed6d4da49ae39334490419993":{"type":"lifetime","days":-1},"022d4ef191ab58b21ec0083f3c100bce3c2a49d35c31eb8306377b5083536785":{"type":"lifetime","days":-1},"a663dbcb04ae28122429dced255f51948a6f769c4f1b9100ad337e7ea249b0c7":{"type":"lifetime","days":-1},"2c509dd42bad075824c5322a4bcda0e05262218b5c79b023947eddef11990066":{"type":"lifetime","days":-1},"a70c299845ffb10a1b182c98ce62ca327072aa61089f80f080d476a8848fd1b7":{"type":"lifetime","days":-1},"c265bcf03e602aea84c158901ce000d41e08bc9b8e7509358310d0feea82e464":{"type":"lifetime","days":-1},"ad1c68e776af795e6a6b2d9b5993866b64bb5b9901b0fe21d85fe35f2153fa73":{"type":"lifetime","days":-1},"cfe3d6ca14d073bdd09d7f41357e36b5aaaf72fe451a1b44e62c7841d54c2c9a":{"type":"lifetime","days":-1},"2ce232f9355e2a82287f4a03b0bacbc52421009d49aa32553fd7e95fb8ba5f7b":{"type":"lifetime","days":-1},"5f4d9b38ff26594a27ebf44658ac7e1de17a1f6a6e395cb94b581b3c3ae4a55e":{"type":"lifetime","days":-1},"868022c3b2b0706f21f2ba623af86502c7709ca52d33663aadf8234d843c4823":{"type":"lifetime","days":-1},"3e6abb2d03eedca5df38f5e323c2d8e8a42d98333d1b5c3e0a0c5dc586c3c1dc":{"type":"lifetime","days":-1},"49c1964d14f3d1fd19c1ac010fead5516dd14d53d4b39d4a85149b61e5d26e42":{"type":"lifetime","days":-1},"8940ac2a3d8afcb02e81d5a30378187caaca8ab8d43624fbbb996498b751414a":{"type":"lifetime","days":-1},"1b4b0cf9778df13a48a5652800a3fe4e8a22e69032c281c20e5c8f468699bef9":{"type":"lifetime","days":-1},"27749e9f03392ab8d122247c2fac2c2c3f1784d66f0218f6602af743d454bc4e":{"type":"lifetime","days":-1},"ba5246ca5a1165edc12e03267c41d8d24be33fe7f0ed96bbc90e34a333d7021c":{"type":"lifetime","days":-1},"2173f6667367c56622951e591782f2f73364cfbac02c8c4aeb8f941df5b1cd16":{"type":"lifetime","days":-1},"47c00c6a14d10989915c55330ead780850679a2df8d55ee3dbd1c5e1e5b2106f":{"type":"lifetime","days":-1},"5c1ca1261ea4274e786c9968b928e08bc25eb9548301322c439c490ab6a6adcd":{"type":"lifetime","days":-1},"31bc0d6a8cd0a701a5af6575274f744d77510706a9af58c592b5382cb90709fc":{"type":"lifetime","days":-1},"fea8a887e167b5ccd99a792a2ae65baba109ab47835fe76037f63af4bc332ff9":{"type":"lifetime","days":-1},"178dfb9cc915264ec6e4698aee7ff0a144a30be785e32a97a21c25347db88e03":{"type":"lifetime","days":-1},"541f738207e7ab232fa187b7eb0491ac4ce99d7d3df5da995c88b9b1a3339c70":{"type":"lifetime","days":-1},"fdccd6482cf0f46bcebf64ffa1732fe896c37c6de524d8245ea3f8f4f3bc854a":{"type":"lifetime","days":-1},"9dadf6cae43c301691759c9fececba3a4991abc70e7c96a8586f98a958eae339":{"type":"lifetime","days":-1},"75e10cc17a8952eee6c329d0120ade20062d9a7d92a7f33f702205f64258a405":{"type":"lifetime","days":-1},"be66d08b887ad39071c706a39549a2aba3402786515afa497a5fb6866b1b23b9":{"type":"lifetime","days":-1},"492781bf97970263056f440ea2dfb636cd8176aa44d5ea9d2aca2c5f759efd5a":{"type":"lifetime","days":-1},"3316734a7896294b71c1fa4d027f7346c3ec9c330f2cf6bc1af13edced92a5ca":{"type":"lifetime","days":-1},"dbf7cf9e17874657c3e26a8ae5c3a4baab193a1e826fb2761494c9ca951b6366":{"type":"lifetime","days":-1},"182340eae0f26dc0ffc4842b033db4c0db355b974b41162075d0d48bc3ef8587":{"type":"lifetime","days":-1},"f9ed27bdc996cb9f540ea0e314b60d3be8b9fba8a0313d757fb9c4d557409d35":{"type":"lifetime","days":-1},"f0ec2ff77e53d1b54c716d9cd91040e1a31dd2aa9e855c778568d617c68aeef1":{"type":"lifetime","days":-1},"88d1cdd610c3c8f8d5efc440e1a77d2d6efa92ca3013f1ce7ecf0f125423bbf4":{"type":"lifetime","days":-1},"e24b31537ca9425229742e0e43e1eeae2be9b905d692cb48aef54ca73541532f":{"type":"lifetime","days":-1},"fbe3953e276641daa039479ac552c0fe22cabf5d243b4f3df5b7b554346e11d1":{"type":"lifetime","days":-1},"3a231d140f924500e5251f3f5edfa537849655de423471ea340f8bcff9f1db42":{"type":"lifetime","days":-1},"c8bfc7e346f1b8090a26a84f4e0415390cb802f38e97257b30a0600e4f1f51dc":{"type":"lifetime","days":-1},"18827ae2a28e3b438eb829a367aa43a4d97392a47fa9b50c8a6b86711cbbef76":{"type":"lifetime","days":-1},"4fbe9ef84077889909a73c2a87026f3c45c62b253b018cb85b3457e55a612fb4":{"type":"lifetime","days":-1},"ea7a22e5e124ad7f606ac18345c9b810b8180db17d2a11884b19679c9faa9660":{"type":"lifetime","days":-1},"ee80d87fba7a6f3215e5629eb372464e91e594e795a22c10fc6924c02df2e538":{"type":"lifetime","days":-1},"cf0df3365c9850a618acf3ca948a0bb7be9984f7926126604e5b7a904d222291":{"type":"lifetime","days":-1},"e2ca2f4e5723f49ea3c2abc144fa44470d479f8166a9386fc4d6629cc86fad29":{"type":"lifetime","days":-1},"ef813b4420a1df58fc22a96823122ee21864fde130e12fbefdb66e616bd4a050":{"type":"lifetime","days":-1},"b8eca23c340abbe64a63c40821a819d8819b36a53a230ef4af1606569087d690":{"type":"lifetime","days":-1},"2d77a5f037165d3c1e35f3daa2b1456156dfe8a57c34d030361e3cd97e829d92":{"type":"lifetime","days":-1},"25468fe24c1ca1977e5e39c5c7f319ddbee704d8c722a280d6d894886a8154b5":{"type":"lifetime","days":-1},"fc99f7e23c449e4e2162a8209775d58f2984cadce0306030e271c7339b4ea7d5":{"type":"lifetime","days":-1},"cdce4e4a7ffc3acfc935eba75095d442f21a1f79c12fe875c857679167c50d2d":{"type":"lifetime","days":-1},"eca73938494cd9e642c099d262924c0d948379e8d1a621752566eda1a9af7271":{"type":"lifetime","days":-1},"dc6bbe677fd24e96e69543d7ff84d80be479270f2652541eabcf7b5652c5b57d":{"type":"lifetime","days":-1},"40d5d896cc8b29e9760e374ad0dc9e0e872caf7a3c1f2f2d4025d6945b242640":{"type":"lifetime","days":-1},"9456875c2fb9acc2cc5b2ea4985d3cbd8bac342cba96e98daa6639487a56ad48":{"type":"lifetime","days":-1},"73ef08c59937f4e2123535ad3cfd9503d9bbed105ade34b44b144c551f5380bd":{"type":"lifetime","days":-1},"04ea4131713428cb066c45969146181c7a89b8d6f59d713631913ed108dd8ddb":{"type":"lifetime","days":-1},"96a4f470d2327845ee49dea2760a69f4bcd4761947dc26f4495da5f8d8d95305":{"type":"lifetime","days":-1},"2bf102c3a1f254f60fe4e8085f4f4a4b9c7b87442bfd45779f47d3250c26567a":{"type":"lifetime","days":-1},"3464b20a2256a4a5b225f3973fe34d87bbb834a851ffe8309d597aa84f90f9f6":{"type":"lifetime","days":-1},"0cda2c8dc8d1f3a7b86c089a7a3720ae0040977324020c4497fd737daee94585":{"type":"lifetime","days":-1},"7758ba176464bb5a52d9c74571c355434f2933ded536385360e234b77c59b093":{"type":"lifetime","days":-1},"1824d044f61bee64f10f1215365d7e9190d0cdaf6c3f26ed6d576a918ced1b93":{"type":"lifetime","days":-1},"11805337fd0a7a3002c0521653aee8680dbcc02bea0a2a431dea21fbc3436db6":{"type":"lifetime","days":-1},"07cd9fe2235bdd5cd1ca86b94b56970568d023733c6986a3a1e8fc50787c085a":{"type":"lifetime","days":-1},"8a6f6c2e5a5f410b0606fc72cb6ad54dde786a2e4c74d023bc0901f88aa5f976":{"type":"lifetime","days":-1},"2edcb5138ff5787bc1e67905bdfbaa14d85b5495eaf5ea84289dd60dab210224":{"type":"lifetime","days":-1},"82a178053f0232332ef93800059358b7beb8b201b1bd4c16a76d502c4e981c49":{"type":"lifetime","days":-1},"45cca65b45050e45f2705949e8b5bac7b0a84decee0433e34c516cf992d15973":{"type":"lifetime","days":-1},"48dd35fbe3a1a6059adfb1de1118a5ff18e0168f2670d5973120a767b78bbf55":{"type":"lifetime","days":-1},"1e32272c5f006efedc95a40f0d34aea2247d44f2cfef32aea747dda13eb02ecf":{"type":"lifetime","days":-1},"f730e373265beebd92bac1f532e38f05e88aaada75a3eb8b19829dcae30e468b":{"type":"lifetime","days":-1},"c97cf9157a011252f6b9c79b738af19b7fb24c51aa10d5b5b79297a2a56be888":{"type":"lifetime","days":-1},"afc94ca92b39a8de232ba81ae361fd06712d6aa368b5d79f5a7b2de28514fc3c":{"type":"lifetime","days":-1},"e6ac247aa61df1e02ce07c67026d29f0345b5921f7bea7e40e37c76f78942dbb":{"type":"lifetime","days":-1},"5c3a4dd082b979a3064aa59668dcf021302be64794f4d38f60a5a1035ae9f27e":{"type":"lifetime","days":-1},"ca9c8dcef65bccb82ca080698ba14b7a4ab3b1f48dc86e76a9a856262207539b":{"type":"lifetime","days":-1},"0dc5891aadb39d82f4de68b85196c731225d9e12ba608eff3c7f810f86f5d2d4":{"type":"lifetime","days":-1},"c8696e421b833ffccc64b692bba6bfd24ea314f836cd2ae1bb6300d030b2c231":{"type":"lifetime","days":-1},"45f88d9f8d9762e3e6acfc42fb8eb2af808ac736385011f699357111771af20b":{"type":"lifetime","days":-1},"4c49a36ecda253ccc6030ec0d4dcf948dc348be784bd8115de684db7e8a9f580":{"type":"lifetime","days":-1},"475b6783c47a61a601588ba38dec7fda1fc0d28a7fa6a31df08fd93965fb7408":{"type":"lifetime","days":-1},"a87052f948f0ed03ebbf72eaa2679e523c40348de7a2a12ae667f0a75fea1828":{"type":"lifetime","days":-1},"7e468deeebbeb55eac3a77b7dd7a2f5605fa2189b6a29bd6aa3cb3678f3b2f0c":{"type":"lifetime","days":-1},"2331996d838294a423efad5543323df5fad472e604eeeba09ec8e2bdd436f240":{"type":"lifetime","days":-1},"0a8a1de009b732d238965426fe00a84f886be536954beaae0b80666ece4ae749":{"type":"lifetime","days":-1},"3be0af59d182de1eeb33ba02c35b4586731559a0193c5c983f51a73db174d1be":{"type":"lifetime","days":-1},"835eb258615fec5d3365a5ae4d1bcef5c6fb1a30c41ed3193056ae35d9c0717e":{"type":"lifetime","days":-1},"e510fd164c3ebcc9cdf2c3e4612424c051e0916f9fcfd97f4f58655d5d06c63b":{"type":"lifetime","days":-1},"1febd8b84a6096633af39247f75f807936c769b63187db53bba8abeff1294175":{"type":"lifetime","days":-1},"c2a7f3c0a29c114893c2ec433b48eb4f0135640c3536448a2f3d32f6b4f8b487":{"type":"lifetime","days":-1},"02321bf23ddbeea80f813aa8c4b637a7db696cae123e2600495729ee221ee0d6":{"type":"lifetime","days":-1},"88af9342c95dbbf3877c4f2575d2af42e2958bc043d835dcd8f24e816de28d83":{"type":"lifetime","days":-1},"b857d5f5d3b27f4a9dd69c138cb8e3cea253f28c343c74900127551014f0d24c":{"type":"lifetime","days":-1},"d36f823e08f22d668b138945cb9a8c87677a7f9b432fdf9fdc8dbb9fbd3d9332":{"type":"lifetime","days":-1},"cb0c2543cac5680cc6a2bc81229ded23bd1143093bb7ed978c239bf5e4124628":{"type":"lifetime","days":-1},"7f1245cb1db876e0c22283d383bcbd83f7bc5c555ef8d50417456508b4c91bde":{"type":"lifetime","days":-1},"119a194f132466fff4699f52a441449feb99f33d7af5e1d6088086d201f3c86a":{"type":"lifetime","days":-1},"36cf31b243e3a4539697649418bec60f656fe48276ae0876ab6eb4ef43aa1ec2":{"type":"lifetime","days":-1},"726f0b251a143770fa3020dc3439591eb99549ed474791a968e918b791de34c6":{"type":"lifetime","days":-1},"4a477a89bc61b15c4d2903f21e26db23e62d4549e22fdfc6f45c74cd44f867fd":{"type":"lifetime","days":-1},"78b12d3d010aeecb876c93d92ddbdccd05d183359e30defb219722c7b34bd8e0":{"type":"lifetime","days":-1},"a6ce38531b6948dedd7e69bb2181bf7950efd2cbf2df1fb3290c5053c681adbf":{"type":"lifetime","days":-1},"1414e81243ab3af58e9dbbc39a97e9e36e55d7fe8d79dd01ab8c2e16d9d6370e":{"type":"lifetime","days":-1},"f702e00a78396ceab1db245e825850c0404362585db2911817e7e8da87dce6ae":{"type":"lifetime","days":-1},"c64dd222fbd5f00adce596efee2f5d2e6028490ebca6698a81a94066477181e7":{"type":"lifetime","days":-1},"5cdc27156c583734e2feb83332d5cf2f3397911ee5419cea47becd9b9b273e05":{"type":"lifetime","days":-1},"877d5fe59a611350a06ed25ee220e0a3492dd38a3cb591a98910762f67e666c2":{"type":"lifetime","days":-1},"f46f906417b5c6d06d1ef1d81462dbdf1c55d2d48c21a7dc35a70ae8429b37f1":{"type":"lifetime","days":-1},"e5c4b1ed9d558a526c715fd6a3b28387ff781b1b16f589777a09149e09718c96":{"type":"lifetime","days":-1},"d89d12771d4f09c26ec2653f5a6bd52f637187c5e17f304d1a50e6fe59855006":{"type":"lifetime","days":-1},"da2e6c9328404e619e465b233d53419e222881bc03bda387783e0eaa727aa436":{"type":"lifetime","days":-1},"fb3a75ef1b7cf33b9900b791a45c678b228a997c1d55d654d1dbe63b55b0984d":{"type":"lifetime","days":-1},"8b16535fc7f95c4acb4ab0c51bcda06a23f86f11a76901c9f17caddc08668cb5":{"type":"lifetime","days":-1},"8cd6800aa22614cf62ad0b1b409c464d491221fde6bf4291fbce8802f3161bbe":{"type":"lifetime","days":-1},"e112d0b92290087326903234195284925c290ee0f4a878edd75f432f231f7a0d":{"type":"lifetime","days":-1},"ad94ff2f395ab532b6d163ed1496e19232a8bff4fa36c0fbbaa4e0ff97683a8c":{"type":"lifetime","days":-1},"94fbfaf9262db6dd95da1465de55af020dc77adb7e65de3d50896cd63f09cc74":{"type":"lifetime","days":-1},"34171387f6e4db2831cb5b3752f60c890962843c46b6a3b3030c24194b450d17":{"type":"lifetime","days":-1},"546c034ece010ca468ed4924462d665c3e754f2fbdb8c0eef458c2c31b7e593b":{"type":"lifetime","days":-1},"fcace08e749a91b084f6414a1f6eb197922f78ec6761688482b7bfb1909b604e":{"type":"lifetime","days":-1},"40121dc62788db011c603d129970c8c8a634d3f4051527c0beb3a2e28f9f1994":{"type":"lifetime","days":-1},"e911af8fc70b3c85b9d7690269518e7e78010c2105b353b73a7878be4561b572":{"type":"lifetime","days":-1},"49316deb321443d9a5851426341915f66ff9aff9b42aab86c1c463b8c157f3f3":{"type":"lifetime","days":-1},"bfdf12bd48619fba56bf514f6939b83b7538e0cc2672602199161e6b9cd0d6e2":{"type":"lifetime","days":-1},"8bb6bf86fce64c136ae235bc47a7402b118aa159ca492a52ba498a3fbbf3a22d":{"type":"lifetime","days":-1},"a87c7096f298fd12f1f800ba61bd56c74b8cf931c36421f3f58a0c68eee63a97":{"type":"lifetime","days":-1},"896f3de825a06c4201ef5c47a59350b5d1c03ac302c9e0f272130e8f0e07b4c7":{"type":"lifetime","days":-1},"79fcfdf6b702b59b42c5ff1d4257a0d5a850ac0e14b9279bd5304bc000e54124":{"type":"lifetime","days":-1},"15cf0f43ecba6c048147caaafaa8d3371d6b8aef39e7b1c418d900dc796af1bb":{"type":"lifetime","days":-1},"80ad89dd74ce6471102ff5e51853474a8ab2c5e1179d4ebcb055c3517cd1544a":{"type":"lifetime","days":-1},"307bb2bf350869fbc805b87c49d8c5f85441c066cf72153ef8316a825e380578":{"type":"lifetime","days":-1},"8bcda0e64b012960bf0df86209fed77f272ee39332f4df320366183cde36b3ed":{"type":"lifetime","days":-1},"5e3a649423bfe32489ddec1034db21ada1ac794d0632952f4df3a286d892f91b":{"type":"lifetime","days":-1},"f862fad34941021d78a82eba2cb6a567aaaa24ed1e5697d9e68ea60c163e98a0":{"type":"lifetime","days":-1},"3c0e3256bcb245d2f5bbf573a2796fac7811e40d4acf5290a8a302189da44b25":{"type":"lifetime","days":-1},"5f1d1fe602f922460cbb30079725cbfa47d55298dc3bc93b0616caed11af014f":{"type":"lifetime","days":-1},"b6619da96d1a65da88fd63b419ad3613299cf593531fd35afd261df6a47fd0cf":{"type":"lifetime","days":-1},"64263378d0af80c01526882142405874addfd313baed65fcbddbc341c40ceb53":{"type":"lifetime","days":-1},"b8f37aca4931afb4eaaf6eb7ee2c053800161b711b47d739eb2fd3d33a4da5c2":{"type":"lifetime","days":-1},"88fc306726016d8b9edaec0a84994bff9141fc9751f1a3bb5fa3307fea731ca5":{"type":"lifetime","days":-1},"8e929951d73002ae8030f8a4eb238b15f7eaa641bcb39316f9cded3a7829a108":{"type":"lifetime","days":-1},"90206c439c1ee6c6d5fef5d59b0cf66a21045670421046b52faaede794cdeff8":{"type":"lifetime","days":-1},"69cd843ac8e57704afb4d0647135ced2140617685968ee953a38f5d87afffff4":{"type":"lifetime","days":-1},"4875996304eaa639066c35542d92a769c0d1c0c3888493c2208b8058a1182600":{"type":"lifetime","days":-1},"a42ac2e2b857dfca0d029ef7ef2b7d42784766833e19aa432411109bc68c9b2a":{"type":"lifetime","days":-1},"c5b489e1b243a9d4424e6cc5859442dd2fb990526c1a481ccb07a87535c32f45":{"type":"lifetime","days":-1},"bd34fe9f1d96bcc6a925a5b75f78f8851052970b61f06706c7f47e9c28bbd2cd":{"type":"lifetime","days":-1},"f283cb5d1bb5f788852b6c3b898fbf871943f3e7eee66c7d23c4d4525f100cfd":{"type":"lifetime","days":-1},"cca3561f27a75663e3370fba5fb43479c5228a4cd9c14f6b96be567967d3da61":{"type":"lifetime","days":-1},"95c37d811095d4891650e546bc7cde5f28b81f38ef71e4006368b5a6cab51d1a":{"type":"lifetime","days":-1},"ff361a523d9f18aa6b87a2671026ddbdeebc47a9e70d3b4c09ca65574e0ffb94":{"type":"lifetime","days":-1},"76370010a62636e7556e6803f263f59f8d9cef760c015f877da9a57155f8eafb":{"type":"lifetime","days":-1},"6b3e25e74b3b092b2d6f09f7209021c3e78cb74b4b995ddd638ed685b957a326":{"type":"lifetime","days":-1},"40fdfc913b41178407949582389bf7c6fb20ddebd7ba86e877cc8af62e3a0a18":{"type":"lifetime","days":-1},"8ad075b60fd3e760bef98c71cc52db0868faf6136bbd46d1b94a832cee7a7670":{"type":"lifetime","days":-1},"cddbef351a507c37b84d092d77eaa26be1f4de91abffafbec404f371ed56ee56":{"type":"lifetime","days":-1},"5afc2220876bc56d598da51a117e7f99d0aa0758446d9512980cdd8a32cd0f01":{"type":"lifetime","days":-1},"0bb0af049b21bf07ae0e29c7ddd105161a7a60eb7b41daad5ffa2a5447342c5a":{"type":"lifetime","days":-1}};

const SK_STORE="medlims_license";

// ── License signature secret — changing this invalidates all stored licenses ──
const LIC_SECRET="MedLIMS_$ecr3t_2024_xK9mP!";

// Sign a license object so tampering is detectable
async function signLicense(lic){
  const payload=String(lic.keyHash||"")+String(lic.deviceId||"")+String(lic.activatedAt||"")+String(lic.expiresAt||"lifetime");
  const sig=await sha256(payload+LIC_SECRET);
  return{...lic,sig};
}

// Returns true only if the license object has a valid signature
async function verifyLicenseSig(lic){
  if(!lic||!lic.sig)return false;
  const payload=String(lic.keyHash||"")+String(lic.deviceId||"")+String(lic.activatedAt||"")+String(lic.expiresAt||"lifetime");
  const expected=await sha256(payload+LIC_SECRET);
  return lic.sig===expected;
}

function loadLicense(){
  try{return JSON.parse(localStorage.getItem(SK_STORE)||"null");}catch{return null;}
}
function saveLicense(obj){
  localStorage.setItem(SK_STORE,JSON.stringify(obj));
}

function licenseStatus(lic){
  if(!lic)return "none";
  if(!lic.sig)return "none"; // no signature = tampered or pre-security
  if(lic.type==="lifetime")return "valid";
  const now=Date.now();
  if(now>lic.expiresAt)return "expired";
  return "valid";
}

/* ── Serial Key Gate Component ── */
const LOGO_URI="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAZG0lEQVR4nO2de7RdVX3vP7+51tqP8wjJyftBQImBIq1oJUBsyQMQOyrhKldeYm+h4K3UdlygeMdoh9jajqpXi1Q6xCuCFSoVVBTsBWKpBhFUHvKQh6mQkARIIOfk5Dz32XuvNX/3jznX4xyhOUFzdsbu/o6xxtmP9drzu37z955HrLVKB20L0+ob6ODAokNwm6NDcJujQ3Cbo0Nwm6NDcJujQ3Cbo0Nwm6NDcJujQ3Cbo0Nwm6NDcJujQ3Cbo0Nwm6NDcJujQ3Cbo0Nwm6NDcJujQ3Cbo0Nwm6NDcJujQ3Cbo0Nwm6NDcJujQ3Cbo0Nwm6NDcJujQ3CbI2z1DaAKSdLqu9gPCAhgDIi0+mb2iZYTrMZgzP5NJGk75HSH9/W0TxaPEb+p37L3aiFOHNn7+RtmCq0jWBWMof7cVsY/dw2mqwrWAoqIoKp+lAURQQRUExRF/Oi7zyV7DaDWTnov6WtV/7lxD4ZOpl2m/HVM5vdgKxW0t5dw4QL00OWYNx1BsHQpEnlirXVbEPw6R+lXRusIFoEkobR0CQPPbyG+43Yi/1UqC+pfp1IzVXKl8NpM+UyYLG0yZf/i6+K18v3yBwTA0RY6oisRcd9cWLYUs/odmPf+N8Lj3o4Yg8TxQTV9S0sbwL0UN8bH2XnCasL/2Izp6kISi4q6QbYA6sjyomvUOAnHSbagGaHGSIFcQbykGq87pxInUthfNdvPiFCUZpGC7i2VsNUSRBXs8BA6uBd7/HGEH72Syvq17hCbINL6abu1BAMkCRKGjDz4E3avPZlIjJ9SLaI6SRLTN07/+SkXefXp2AiigpAAgkklyv8xKrnUFo9X/LFOVYi/uIhgFHcD1t9EVxW7bAmycCHNnz2FfWE78uEPU/7kpyh1d6FJ0nLd3HqCAU1iTBjxymevZuSyS4lmzXbGi1rPR0qmgy0Mfkqq5LuB17NGlVRhT9LX6YXFEWlSIoufkxMuKcHkD4m7piL1BlqtYFe/A63Xad6zkfiktfR+65uEfX2otdl1W4GDgmBUnYESBrxw+nto/uvthL2HQDP2ukxBbb476YDnKBIsBcLSwTUIYsTv44wnYySb9kVBBUQL502ndzFeFfjp238nxjhpTyw6NoaeeipxENG883aSk09jzv/7NkEYpU/IARi4faP1SgLyAVCY/4XPEy9ZSnNiAmsM6vWvIlhxG4hzn9WpaAskqqg4kixgDWggaBj4zaBGsKHBhgGEATYISAKDNQaLm/YtlkQVi7rPAIuSqJKk31mLVXfNJLHEgO3uRjduxMzuhRN/h/jfN7L3k59GgsB7By0a2oNCgj00TjBRyJ7vfIedG86g2t2NsZr7pJpLm4ig2EwwtDBdg5NO22gQN5uZdews8nSaVgTj9HAYUCp3AYmTTHIDyx1XmNq9jhf/UBaNNeIYenvh7Pcx8pUbSVSZ+9OHqaxYgSaJk/gZxkFFMOT6+IXLLmf0s1cR9fQizSRXnOngkhpamuvMdNo2BjtRo3TRRfRs2ACNBpjceEunaKxiymUmnnyS+kf/irBcRm3sdXtBd9t8hnW6N9fRUDACgwAdHsKceSb1gQFqm75H5aMfY/7H/wptNiGcea/0oCMYVVQVjWO2rDuZxo/up9TV7aY5b/CkEpVa0rm7JBhRJDA0Rkc55Nprmf/Hf7zPS44+/Ah7TjiRqKsLksQZZz7gklnW5K5SSjJ2svEn4h4sOeYY9LffzugNX8Ss/h0W3/eD3AuYYRwcOrgILypBucySG66HBQtoxk3UCGogQUnUur9+s35TdbrRevnT8RqaJCQTE9g4Rqdstl6HJMGOjICkOjh1vZ2ez3Q/gqq4gJUWrilgve2mqpgwgN27obcHG0Q0fvEczf7d3sCbeVk6+AgGxBhss0n3UUfSdeo7sX6KTSXWCtngqvgwiB+7BIi98aWBQYIg23iNTYI8dib+nIkXUFVQdfrWXdeFUa213vjLyUYt1hiS2jhSCqGnh2RokHj3bn/6mSe45cmG10IxYAGgVrCaasZicMLbuSIk6qRIEGJyg2rfFzNYMV5y0+CKpoY9oBjNDS21qasG2PxeYv+9TSxBYLBhiI1jknrjVx2O142DlmAgc50skHhFqFpIRjiFiIpgUfcsqHsw9kdWVC3WJhnBk58Ld6ZAcl2cRr8s/haKV7MWWwoxQUAyUYNymaDa9bp+/q8DB+UUXYQWYsvptFz41hNt0GwTN736/ad1DSDO/N5U97qHSVX99CxYI5lfXlQRmT0gkDSbyLz5EFvs2CjaN4dw4Xx3oRYEOw5uCYZXTeZm1rNM9lfT6VQzCZ7mgKaEUhBg0UJWKo0/u+tZHzYTr6Mz3owhsU1KRx5FY9t2EhHCI48k8iHLVhB8cEiwta9pgKQRJeslx0UeJDOuLEUr2kt4wWeeFvy5FLCiJOBmAxNgTQBaOH/hntQ/DakkoxYtlTDHHM3wT35MU5XeDae7AEuLqlZaLsGqFhMEboDjwiAkidfBNkv9JViEAJMm1b0aTgMN2QMQBC6oEEzv+VVATYAag/X+b4LLHgmgWU5fUOsodqkGL/cKhCHJyDCVd29g7KVd1LY+R7B0GbPPO9fZDS0qBGgpwQqICaht3060eDFhFOVf+qiPiUpOglVADUmjTrOQeEiJLU5+BmiAM3Kmg2ZMs9lEm0PZubyBnF0jPX8kQlTtQX1cWlEIQ3RkmGjFCuS4VfRffTUxsPDjH6cyfwE2jv+LEFzQnerzwLv++Sa2/cmf0rt+LYsu+p8uTejNnUSV0Z88iBpDYsDGDSpr1rDggxeR1Bs+F0zOcBofFiGp1+k64QSnI19jcMW4WHTl6N9g8fU3IFE4KSPl9DnuAtYipTJjd99NfPPNmEoVFYtKgI6OYg49lMr7P8BLX76B8cF+5n/oEhZdeEFLyYWZJFjV5WnF6yPrEvqjj/yU+vAQybdvZ+SRRzHemLG1GvHAbgxgwhJhvY5aS7hyJfPPPW8/Lquvbdx4X7uyeDGVCy+Y1vnikREmbrqR0Bg0BtuYwBx9NOGatbz0xS8wtnMniy75Ew7/3OcOioT/jBEsxmCtJbGWMAh99EhYfuWVaLnMIatPZP7pG9DE5YUB4tEx7Pg4iLDjissZ/MqNaNOHGachGTLNake1dp9GkMYxJopIRkexQKwJtqeCHn40GgQMXft5tG8uh91wA0suuAC1CVqoNmkVDjzBXoLGdrzAU+ecg9QmWHnzjXQf9gY0iQm7uljxyU+6XcfH0DCk+cxmBq//MjqrBzUhplKh/otnc50Yhm5G/nVNfSLINDI9EoausE4E6euDKKKx62Xo6Wb+lVcy/4MfpLJ0KRo3wQQtJxdmgGBNEkwUMXDvJgYeuJ8q8MTbTySY3wexSxVInPj8rrg66VoN9gz4cKOraExvdLrBiwOFtFpEw5DG0kOZs349s997BrN+87fyncIIjWM3g7S7BEsQoGqZd+opzH3nacR7B3nTx/+asM8RnIYjNYnzoIYxBLN6MdUKe++8E7t7N4N3fIexJ55AW6zTFCFB0WaDuDbCwF3/yq6bbiKqjdP7trcy+5yz6TntXVTmzQP4r2BkCVhL18JFvH3j3ShKMM0I09jW55n7399HMKuX2s5dDD/xBC1Jqhbhgx1m7zDVWo1g+eGEa9chC+bR+OF9bD//A0SzDuGQD13C/A9fQnXZMpIkdgX37RiqFCMoAeM7X6Rr8VLUKkmj7tJ/1hJWKtSHBtn2matgeAQTCBpETOx8kb1fvTk/T9n5yNbGB/qW/1O434ObdYbHSB57lOZjjxIe+Rv0XnwR8674CLuvvJKdn/oEe278Cov+9m9YdOGFLlT5n1n0BwgHjmDv88a1CZ68+IMMP/Rj+tau55gv/l+CSiXbrbZzFw+dsh7qDSqHHwH1CZdgqFbpPnE17B1ExVDf+RJxfdAFF9I2kX0N1v5UM+6rMM5fM806Bf78WqogIjR//nP6L7uU3nf9Hod941Zeue4GXv7UJ3j+j/6IkUcf44h/uDpLRc4kyQeMYE0sJgp58ZavM771eU76+TM8+Lsn8dCaNZQWL0EbdYJSiT3f/z59Gzbwm9dd98vnwIcyxfD0hz7Eti98gdnlirNkS6Xp3cd04tEi+3a50u/D0EfWrKvPTgsBSyWCIGD07rvYtu5kDv/J/Zi+Pnb87yt45R+vwdZqrPzSda4wbwZ18oGTYP+Udh2+nNpAP1u+9GXGB/Ywd906SnPmOIlIElb8/adZev4f8PI9/0byym4wAYghHh3hhX/6CkmjQeDdJBGI+/sZ37oVW2+4aozCtdIpUARskhDNn09p9ux9To3J+DiNF1/0VY95BKt4bk1ipFymvvMln3/OI9KCSytpbDFd3SQ7trNl9Um8afPPqT+/lYFrP8/u679E5c1v5rBL/xdJ3MQEMxOCOLBFd744fPuNN7Hjlq9x6Af+gOXnnP1Luz183rkMfvsOulascNWHgSERw9CTP6OOmw67gHIYYkWQUuQL1KcUvRnjOhWCgObYOMuvuoo3/NmfYpvNV/VzNUkwYcjgD3/I5lNOpVSpuFKcrJ8pryxx0VDXXBbY2M8uvtjPdyGmBXoSlYjHR+g993wOu/kmHl2xkvrW57DVLt7y0IP0HnWUe8BnwCM48FWVaQeAh41jFzUSgxh44PQzGH36adY9/ijl2XMmHTo20E/txZcIe3vYesVH6P/mbUTlMtpsZr1CrobKS5lvJwlMQL0+wRv//ioOv+zSfRI8cO+9/MfatUSVqoukeYlPHyCUfCou/havUwPfZJZKfBoaTxoTrHzmaYYef5zN55xDAPT94YUc8+XrZ8x9OvDzhAg2dpZv2rsblMvYZoMfnPJOGkNDrHv8MX7x+WsZ2/Y8R3/sY1Rmz2b4qSfZ892NBN2zEBFqO7aDcaU54tOLSbE+2ZOcqKBiSESw05QQRV1yXgwYJS0bSdOUKuqklTwHnOeYNCPUlVq7UIwJQyzKy5/7R5ZfczVbFi3BvryTPXfczviuv6Vr0eIZKQKYEUWQPqnGS1FjeIjvr1lLVOnilEceZvfDD/HgX/4FJWDrLbdieroxw8MkIyMEQBWIAAlLJIlisk4xS5oQFi91LilvSFTJE377vENfMutLdFQdz4A7uSPB+ITzpMI/ddE1g29VTc0B6xrnRjdtIgxCZq1dQ//X/oVkzwAD3/s+Xeedl2XUDiRmJiykbjB2bdrE9jvuYOOqE4iWLGHt/fchYug5dDmLV69mzlt+i9+99VbW33Yba77375z21M9YvP5kgihCKlUStb5PiMLm3sf+vVVvv+GMoNd5u65EVtLyHIe07irrhUqrTPD9S+TBOKvq6qJ37CCpjdN93HE0/HmHH37k9Y7kfmNmYtFhyAt3b+T+33sXE8Cy97yH9bfd5jIuVulevIRT770XTWKicmXS8eVlS+lvNomyKo60eopCB5H1SzO4ITdp2c1+WBdZ85nmtKUdFFn8u1CLBYrVdGmJ4v2419bnoZOxcRr9eygtP5QYiBQmtmxx+8+APzxj6cKk0ST2F3zz5ZcDrn7YhCFqLSYInd6K46wgwIQhcb3hJMZbt8VBkQLRk0pX8YRNv+bOFcz7Ssm8EsfVRov/MH+cyKhHc6MqPZdPfSOqTierEpTL2bG1gX53tzNgRc9MssEqyze8m3d84xto3GTe8cdjbZLpZFetaFFbCCh4MmOBCaBCwR3yxxQFa3I/8ORBnw7SlhWrZI3l6kk1/l5stpCLZE3oxjcWa/GqfhrXOEaqXZT65tAcGs4ejMSXHO3vPb4ezJC37aaxw888E8jdi1/aaeqHIsRRyDhQUbcYQ0q8W1rBWUJBOrRGXLtJqg+9wZRtU1H4LpW8TAFoKr1kqcy0AkT9vYH41Rwycyz9JSAGqwmyZBFhTw9jW7eQlhSYSqVgkbeBFQ3uR6fu0j79v1R645hdTz+Tk5V9rQUSJDeEfKG68Q+D+nysBMFr9+aKZLVZiVq/5AK+29+fVtLuRfdLpHCsFqZu8Q+XUbeIS1OEWW/9bQAGH3oYgCZQWrgku98DjRktupuuY2+ThCCKuO/P/5wdjzzCojDEqnv+85L2fIpOCrrZFjoEm7UJ4kYDW28gYZC7rj62o9ZiSmWaEzVifIO418GCYCWNNdtJSzuk2SSZOumoozsRwMeqF/2P99Os1+n/8Y9QE9CwCd1HH5Xtf6Bx0PUHpw3gz37rW3z7ve9lVhRxSJI4g8WP5tSlkKa+Tv3hcE4fwexDCBLvD7vYI8Z6SRNBghCtjaM7d3mr2Rts3mI2TF7wJQtpeCkFZ4Sl/cmIhcBgGw3KK1ZywjNP89zXb+VH55xLtVymUa9z0j33sPTkk2ckmtXywvci1FpMGDG0bRvfvfhiysZQ1Xy9jFRiA/EPv+RCIHin3ik3EIgH+okH+iddQwr7TnodhKSmT1rwLuLqsQ15s5vgGx7F+cXunJq5SM6iN9StsuJv/ho1hl/8n89gRIibTapLlzF/1Sp3XDtY0dOG159JEnP3+edTHxhgdhRikoRmwX4uzLCI5g5LFj10J3PGVxBkUpZarM44y3Wq8eeyWVbI7Wtwilg094PFR6ym+smaPlSARCETtRpzz3ofS886m83XX8fOnz5Cd6XC+MQEy886i1Jv74zFog+aKdrGCUEU8oMrPsJDn/k0s0oR3bH13XuQWEXF6cHMXSGVxLxRjEnTqZO2gMldCmmWyKhP95k0vqjeaDKO+IKFaxSMKRLrAx7eykaUIApp1CboXXU8J/5gE3u3bOWOE1cjY6MYAY1KnP74E8w54o1Ya2dEgg+K5jNnVIVsvu2bPPyZT1MthUQ28R31ENvJSzUU4UygAIshwVnP6XGTlljSfP/MJVLf9qnpMkkuWVFsaLPiQ5Ka75eqjEQgMZAEASrCWG2CnnXrWHXPv1EbGuKeM8+kObQXiULGmzFHXnYZc1YcgZ3BFXdaLsEuihUw+OyzfHXVKuKhIaoilDQNHeikAAPk7surQdL9vJVr0GxJRNfqorlRJOIXXEndWuNcrzRzhCX4Jbcov4YxAaKWuOmibYd9+M946zX/wMgLL3Dnuzcw/PijlCtVJiZq9B37Fs64/wHCcpn9KiX6FdFaHZzWbTUa3Hne+6kNDtIVhpjELbJiJZW8dOmiXBemn5K2jEIW3cqtYHCWcG7xBpmt7F0hUuPJ5DrWZBO8P61/sIzTy6oWmk0aNFFg4Sknc/TffYK5xx3H83fdxX0XXcz4Sy9Srlap12oE8+ay7mtfI+rqctLbDjVZ00Hq79576eW89NCDVKOIMElAfOoO45P5PufqndQ0EW9Fs+azNPAB+PRhznG6NEOepvA6ddLdJJNDoUwOJdrCZwboWrCQpae9kzdecgkLTjiBsf5+Nl18Ec986XpCoFKtMlGrIX19vOv2O5h75FEtqZFu2RRtk5ggjNh869e56+yziMKIwCZE1i0NmPYYpssJGnJCUhenmJ5zs55b+jDtMAT3NzDGzQDGOzHGNcEFPsJlAoOI75cygpiAMAyzvuWwWqG8cCGzjjiCQ95yLPOPX0Xf295GIIaBzZt58ppr2HLTTTSGh6lEESpCvdGgZ+VKTrnlFhYee+yM1mEV0RKC1VokMOx59jn+ZdXx2KG9GKAUhpT75iC9h0C1inZXoVIhLFWo9nQRVisEUZlypYugUsZEJUy5RFCKCEplgmoVE4YEYYgplZBSRFAqYaLQdSiWS5gwIIgiglLFvY8ijN/fRBGmVEYCQxCFmCBERdxrExAnCfVXdjP41JO8eM89bNv4XfY89igWqIoQlso06hPEwMrz38+Jn72a6rx5Le1umHmC1aLWWaFfX7OGnQ88QKmQJiQwWbgAbwila0JbXB4uWz7YG0ZZUaWX4qxv2BgCbxgh4pd3cLHn0DjpdcsvGDRwEuvINE7axakIo0oyNk59zyDx3j1Z0iAAwiiEJKHuh3HRcat428eu5A2///sAJEmMMW3dujIZahUThvz4L/6SnQ88QKVSIYnjrGPQCq5HOFOsTNKdU3VpFp2e+ph6y7nYB6GFv+l0n6qA4mepr5zp68LfdLP+3I1mTNesWSxfs5ajLvhD3njGBgITOKk1pqXkwgxLcJrEf+qrX+U7559PCSh25RYHVF7l8xQy5fPXskmz8CWTjaTiMVMNqqnkTrannd4uzZlD17JDmffWY1m6bj3L1pzErOXL3XlUsUmSryPSYswswd633b7pe9QH9xIEATb9LylMkZgCa6mEaiHwPwmvxnAaYSpeuxC7frXD0gXBRYrVVs71CsslwlmzKM+bR9eChVTnzp1khdvEL0Vsgtd+4lqAlhhZB0Nj9K8KJ6mx/x8PpiVrQU8HLbOiNf3HFgcYU6fz/Cbcl8WZQ/KPX21Xv5MU3LCDHy0PVXZwYHFwzisd/NrQIbjN0SG4zdEhuM3RIbjN0SG4zdEhuM3RIbjN0SG4zdEhuM3RIbjN0SG4zdEhuM3RIbjN0SG4zdEhuM3RIbjN0SG4zdEhuM3RIbjN0SG4zdEhuM3RIbjN0SG4zdEhuM3RIbjN0SG4zdEhuM3RIbjN0SG4zdEhuM3x/wFenwVu9irhLgAAAABJRU5ErkJggg==";

function SerialKeyGate({onActivated}){
  const [key,setKey]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);

  const submit=async()=>{
    setErr("");setLoading(true);
    const trimmed=key.trim().toUpperCase();
    if(!trimmed){setErr("Please enter a serial key.");setLoading(false);return;}

    // ── Step 1: Validate key locally ──
    const hash=await sha256(trimmed);
    const entry=KEY_MAP[hash];
    if(!entry){setErr("Invalid serial key. Please check and try again.");setLoading(false);return;}

    // ── Step 1b: Check local blacklist — blocks reuse of expired/used keys offline ──
    const BLACKLIST_STORE="medlims_blacklist";
    const blacklist=JSON.parse(localStorage.getItem(BLACKLIST_STORE)||"{}");
    if(blacklist[hash]){
      setErr("This key has already been used and expired. Please purchase a new license.");
      setLoading(false);return;
    }

    const deviceId=await getDeviceId();

    // ── Step 2: Check Google Sheet for status + device lock ──
    const SHEET_ID="18pzQW6JNoqXVnXXRmmFSWF3bw2RBC9LSJM2XFM4OZVo";
    let onlineStatus="offline";
    try{
      const url=`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),5000);
      const res=await fetch(url,{signal:controller.signal});
      clearTimeout(timer);
      const text=await res.text();
      const json=JSON.parse(text.slice(47,-2));
      const rows=json?.table?.rows||[];

      let found=false;
      for(const row of rows){
        const rowHash=(row.c[0]?.v||"").trim();
        if(rowHash!==hash)continue;
        found=true;
        const rowStatus=(row.c[3]?.v||"").toLowerCase().trim();
        const rowDevice=(row.c[4]?.v||"").trim();
        const rowExpiry= row.c[6]?.v||"";

        if(rowStatus==="revoked"){setErr("This key has been revoked. Please contact support.");setLoading(false);return;}
        if(rowStatus==="banned") {setErr("This key has been banned. Please contact support.");setLoading(false);return;}
        if(rowStatus==="expired"){setErr("This key has expired. Please purchase a new license.");setLoading(false);return;}
        if(rowStatus==="disabled"){setErr("This key has been disabled. Please contact support.");setLoading(false);return;}

        if(rowExpiry){
          const d=new Date(rowExpiry);
          if(!isNaN(d.getTime())&&Date.now()>d.getTime()){
            setErr("This key has expired. Please purchase a new license.");setLoading(false);return;
          }
        }
        if(rowDevice&&rowDevice!==deviceId){
          setErr("This key is already activated on another device.");setLoading(false);return;
        }
        onlineStatus="ok";
        break;
      }
      if(!found){
        setErr("Key not recognized by server. Please contact support.");setLoading(false);return;
      }
    }catch(e){
      onlineStatus="offline"; // no internet — allow with local check
    }

    // ── Step 3: Offline device-binding fallback ──
    if(onlineStatus==="offline"){
      const used=JSON.parse(localStorage.getItem("medlims_used_keys")||"{}");
      if(used[hash]&&used[hash].deviceId!==deviceId){
        setErr("This key is already activated on another device.");setLoading(false);return;
      }
    }

    // ── Step 4: Save license ──
    const used=JSON.parse(localStorage.getItem("medlims_used_keys")||"{}");
    used[hash]={deviceId,activatedAt:Date.now()};
    localStorage.setItem("medlims_used_keys",JSON.stringify(used));

    const now=Date.now();
    const licUnsigned={
      type:entry.type,days:entry.days,keyHash:hash,deviceId,
      activatedAt:now,
      expiresAt:entry.days===-1?null:now+(entry.days*24*60*60*1000),
      onlineActivated:onlineStatus==="ok",
    };
    const lic=await signLicense(licUnsigned);
    saveLicense(lic);

    // ── Step 5: Done — let handleActivated take over ──
    setLoading(false);
    onActivated();
  };

  return(
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(160deg,#1a0000 0%,#6b0000 50%,#1a0000 100%)",
      display:"flex",alignItems:"center",justifyContent:"center",
      fontFamily:"'Segoe UI',sans-serif",position:"relative",overflow:"hidden"
    }}>
      {/* decorative circles */}
      <div style={{position:"absolute",top:-80,right:-80,width:320,height:320,
        borderRadius:"50%",background:"rgba(200,0,0,0.12)"}}/>
      <div style={{position:"absolute",bottom:-60,left:-60,width:240,height:240,
        borderRadius:"50%",background:"rgba(200,0,0,0.10)"}}/>
      <div style={{position:"absolute",top:"30%",left:-40,width:160,height:160,
        borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>

      <div style={{
        background:"rgba(255,255,255,0.97)",borderRadius:18,
        padding:"44px 48px",width:440,
        boxShadow:"0 30px 80px rgba(0,0,0,.5)",
        position:"relative",zIndex:1
      }}>
        {/* Logo + title */}
        <div style={{textAlign:"center",marginBottom:30}}>
          <div style={{
            width:96,height:96,margin:"0 auto 14px",
            borderRadius:20,overflow:"hidden",
            boxShadow:"0 8px 24px rgba(180,0,0,0.3)",
            border:"3px solid #e8e8e8"
          }}>
            <img src={LOGO_URI} alt="MedLIMS" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          </div>
          <div style={{fontSize:24,fontWeight:900,color:"#1a0000",letterSpacing:.5,lineHeight:1}}>MedLIMS</div>
          <div style={{fontSize:11,color:"#c0392b",fontWeight:700,textTransform:"uppercase",
            letterSpacing:2,marginTop:4}}>License Activation</div>
          <div style={{width:40,height:2,background:"#c0392b",margin:"8px auto 0",borderRadius:2}}/>
        </div>

        {/* Input */}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:10,fontWeight:700,color:"#888",textTransform:"uppercase",
            letterSpacing:1,display:"block",marginBottom:6}}>Serial Key</label>
          <input
            value={key}
            onChange={e=>setKey(e.target.value.toUpperCase())}
            onKeyDown={e=>e.key==="Enter"&&submit()}
            placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
            style={{
              width:"100%",padding:"12px 16px",fontSize:13,fontFamily:"monospace",
              border:"2px solid #e8e8e8",borderRadius:10,outline:"none",letterSpacing:1.5,
              boxSizing:"border-box",textTransform:"uppercase",color:"#1a0000",
              transition:"border .2s",background:"#fafafa"
            }}
            onFocus={e=>e.target.style.borderColor="#c0392b"}
            onBlur={e=>e.target.style.borderColor="#e8e8e8"}
          />
        </div>

        {err&&(
          <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,
            padding:"9px 13px",fontSize:12,color:"#dc2626",marginBottom:12,display:"flex",gap:7,alignItems:"center"}}>
            <span>⚠</span><span>{err}</span>
          </div>
        )}

        <button
          onClick={submit}
          disabled={loading}
          style={{
            width:"100%",padding:"13px",
            background:loading?"#ccc":"linear-gradient(135deg,#c0392b,#8b0000)",
            color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,
            cursor:loading?"not-allowed":"pointer",marginBottom:18,
            boxShadow:loading?"none":"0 4px 16px rgba(192,57,43,0.4)",
            letterSpacing:.5,transition:"opacity .2s"
          }}>
          {loading?"Verifying...":"Activate License →"}
        </button>


      </div>
    </div>
  );
}

/* ── License Expired Gate ── */
function LicenseExpiredGate({licType,onReactivate}){
  return(
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(160deg,#1a0000 0%,#6b0000 50%,#1a0000 100%)",
      display:"flex",alignItems:"center",justifyContent:"center",
      fontFamily:"'Segoe UI',sans-serif",position:"relative",overflow:"hidden"
    }}>
      <div style={{position:"absolute",top:-80,right:-80,width:320,height:320,
        borderRadius:"50%",background:"rgba(200,0,0,0.12)"}}/>
      <div style={{position:"absolute",bottom:-60,left:-60,width:240,height:240,
        borderRadius:"50%",background:"rgba(200,0,0,0.10)"}}/>

      <div style={{
        background:"rgba(255,255,255,0.97)",borderRadius:18,
        padding:"44px 48px",width:440,textAlign:"center",
        boxShadow:"0 30px 80px rgba(0,0,0,.5)",position:"relative",zIndex:1
      }}>
        <div style={{
          width:96,height:96,margin:"0 auto 14px",
          borderRadius:20,overflow:"hidden",
          boxShadow:"0 8px 24px rgba(180,0,0,0.3)",
          border:"3px solid #e8e8e8"
        }}>
          <img src={LOGO_URI} alt="MedLIMS" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        </div>
        <div style={{fontSize:22,fontWeight:900,color:"#c0392b",marginBottom:6}}>License Expired</div>
        <div style={{width:40,height:2,background:"#c0392b",margin:"0 auto 16px",borderRadius:2}}/>
        <div style={{fontSize:13,color:"#666",marginBottom:24,lineHeight:1.7}}>
          Your {licType==="demo"?"demo (3-day)":"monthly (30-day)"} license has expired.<br/>
          <span style={{color:"#27ae60",fontWeight:600}}>✓ Your saved data is intact.</span><br/>
          Enter a new key to continue.
        </div>
        <button onClick={onReactivate}
          style={{
            padding:"13px 36px",
            background:"linear-gradient(135deg,#c0392b,#8b0000)",
            color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,
            cursor:"pointer",boxShadow:"0 4px 16px rgba(192,57,43,0.4)"
          }}>
          Enter New Key →
        </button>
      </div>
    </div>
  );
}

/* ─── Helpers ─── */
const uid = () => Math.random().toString(36).slice(2,9);
const toInputDate = () => new Date().toISOString().slice(0,10);
const calcAge = dob => { if(!dob)return"—"; const now=new Date(),b=new Date(dob); let y=now.getFullYear()-b.getFullYear(); let m=now.getMonth()-b.getMonth(); if(now.getDate()<b.getDate())m--; if(m<0){y--;m+=12;} if(y<1)return m+"mo"; return y+"y"; };
const fmtDate = d => { try{ return new Date(d).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}); }catch{return d||"—";} };
function dbLoad(key,fb){try{const v=localStorage.getItem(key);return v!==null?JSON.parse(v):fb;}catch{return fb;}}
function dbSave(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch{}}

// ── Chunked storage for large arrays (results, patients) ──
// Splits data into 500-item chunks to avoid single large JSON blobs
const CHUNK_SIZE=500;
function dbLoadChunked(baseKey,fb){
  try{
    const meta=localStorage.getItem(baseKey+"__meta");
    if(!meta)return dbLoad(baseKey,fb); // legacy fallback
    const {chunks}=JSON.parse(meta);
    let all=[];
    for(let i=0;i<chunks;i++){
      const part=localStorage.getItem(baseKey+"__c"+i);
      if(part)all=all.concat(JSON.parse(part));
    }
    return all.length?all:fb;
  }catch{return dbLoad(baseKey,fb);}
}
function dbSaveChunked(baseKey,arr){
  try{
    // Clear old chunks
    const oldMeta=localStorage.getItem(baseKey+"__meta");
    if(oldMeta){const {chunks}=JSON.parse(oldMeta);for(let i=0;i<chunks;i++)localStorage.removeItem(baseKey+"__c"+i);}
    const chunks=Math.ceil(arr.length/CHUNK_SIZE)||1;
    for(let i=0;i<chunks;i++){
      localStorage.setItem(baseKey+"__c"+i,JSON.stringify(arr.slice(i*CHUNK_SIZE,(i+1)*CHUNK_SIZE)));
    }
    localStorage.setItem(baseKey+"__meta",JSON.stringify({chunks,total:arr.length,savedAt:Date.now()}));
    // Keep legacy key in sync (small copy for backwards compat — skip if too large)
    if(arr.length<=200)localStorage.setItem(baseKey,JSON.stringify(arr));
    else localStorage.removeItem(baseKey);
  }catch(e){console.error("dbSaveChunked error",e);}
}

/* ─── Data ─── */
const SECTIONS=[
  {id:"hematology", label:"Hematology",     icon:"🩸", color:"#c0392b"},
  {id:"bloodchem",  label:"Blood Chemistry", icon:"🧪", color:"#e75480"},
  {id:"urinalysis", label:"Urinalysis",      icon:"🔬", color:"#c8a800"},
  {id:"serology",   label:"Immuno-Serology", icon:"💉", color:"#16a085"},
  {id:"bloodtyping",label:"Blood Typing",    icon:"🅰",  color:"#d35400"},
  {id:"fecalysis",  label:"Fecalysis",       icon:"🧫", color:"#27ae60"},
  {id:"microbiology",label:"Microbiology",  icon:"🦠", color:"#2e86ab"},
  {id:"coagulation", label:"Coagulation Studies", icon:"🩺", color:"#7f8c8d"},
  {id:"othertests",  label:"Other Tests",  icon:"🔭", color:"#1abc9c"},
];

const DEFAULT_TESTS={
  hematology:[
    {group:"Complete Blood Count",tests:[
      {id:"hgb",name:"Hemoglobin",unit:"g/dL",normalMin:12,normalMax:17,normalText:"12 – 17"},
      {id:"hct",name:"Hematocrit",unit:"%",normalMin:37,normalMax:51,normalText:"37 – 51"},
      {id:"rbc",name:"RBC Count",unit:"x10⁶/µL",normalMin:4.2,normalMax:5.4,normalText:"4.2 – 5.4"},
      {id:"wbc",name:"WBC Count",unit:"x10³/µL",normalMin:5,normalMax:10,normalText:"5 – 10"},
      {id:"plt",name:"Platelet Count",unit:"x10³/µL",normalMin:150,normalMax:400,normalText:"150 – 400"},
      {id:"mcv",name:"MCV",unit:"fL",normalMin:80,normalMax:100,normalText:"80 – 100"},
      {id:"mch",name:"MCH",unit:"pg",normalMin:27,normalMax:33,normalText:"27 – 33"},
      {id:"mchc",name:"MCHC",unit:"g/dL",normalMin:32,normalMax:36,normalText:"32 – 36"},
    ]},
    {group:"Differential Count",tests:[
      {id:"seg",name:"Segmenters",unit:"%",normalMin:50,normalMax:70,normalText:"50 – 70"},
      {id:"lym",name:"Lymphocytes",unit:"%",normalMin:20,normalMax:40,normalText:"20 – 40"},
      {id:"mono",name:"Monocytes",unit:"%",normalMin:2,normalMax:8,normalText:"2 – 8"},
      {id:"eos",name:"Eosinophils",unit:"%",normalMin:1,normalMax:4,normalText:"1 – 4"},
      {id:"baso",name:"Basophils",unit:"%",normalMin:0,normalMax:1,normalText:"0 – 1"},
    ]},
    {group:"ESR / Bleeding",tests:[
      {id:"esr",name:"ESR",unit:"mm/hr",normalMin:0,normalMax:20,normalText:"0 – 20"},
      {id:"bt",name:"Bleeding Time",unit:"min",normalMin:1,normalMax:3,normalText:"1 – 3"},
      {id:"ct",name:"Clotting Time",unit:"min",normalMin:5,normalMax:11,normalText:"5 – 11"},
    ]},
  ],
  bloodchem:[
    {group:"Blood Sugar",tests:[
      {id:"fbs",name:"Fasting Blood Sugar",unit:"mg/dL",normalMin:70,normalMax:105,normalText:"70 – 105"},
      {id:"ppbs",name:"2 hrs. PPBS",unit:"mg/dL",normalMax:200,normalText:"< 200"},
      {id:"rbs",name:"Random Blood Sugar",unit:"mg/dL",normalMax:200,normalText:"< 200"},
    ]},
    {group:"Cardiac / Lipid Panel",tests:[
      {id:"tchol",name:"Total Cholesterol",unit:"mg/dL",normalMax:200,normalText:"< 200"},
      {id:"trig",name:"Triglycerides",unit:"mg/dL",normalMax:150,normalText:"< 150"},
      {id:"hdl",name:"HDL Cholesterol",unit:"mg/dL",normalMin:36,normalMax:60,normalText:"36 – 60"},
      {id:"ldl",name:"LDL Cholesterol",unit:"mg/dL",normalMax:150,normalText:"< 150"},
    ]},
    {group:"Kidney Function",tests:[
      {id:"bun",name:"BUN",unit:"mg/dL",normalMin:15,normalMax:39,normalText:"15 – 39"},
      {id:"creat",name:"Creatinine",unit:"mg/dL",normalMin:0.4,normalMax:1.4,normalText:"0.4 – 1.4"},
      {id:"uric",name:"Uric Acid",unit:"mg/dL",normalMin:2.6,normalMax:7.2,normalText:"2.6 – 7.2"},
    ]},
    {group:"Liver Function",tests:[
      {id:"sgpt",name:"SGPT / ALT",unit:"IU/L",normalMin:0,normalMax:41,normalText:"0 – 41"},
      {id:"sgot",name:"SGOT / AST",unit:"IU/L",normalMin:0,normalMax:40,normalText:"0 – 40"},
      {id:"tbili",name:"Total Bilirubin",unit:"mg/dL",normalMin:0.1,normalMax:1.2,normalText:"0.1 – 1.2"},
    ]},
    {group:"Electrolytes",tests:[
      {id:"sodium",name:"Sodium",unit:"mmol/L",normalMin:135,normalMax:145,normalText:"135 – 145"},
      {id:"potassium",name:"Potassium",unit:"mmol/L",normalMin:3.5,normalMax:5.5,normalText:"3.5 – 5.5"},
    ]},
    {group:"Other Tests",tests:[
      {id:"hba1c",name:"Glycated Hemoglobin (HbA1c)",unit:"%",normalMin:3.5,normalMax:6.0,normalText:"3.5 – 6.0"},
    ]},
  ],
  urinalysis:[
    {group:"Physical Examination",tests:[
      {id:"ucolor",name:"Color",unit:"",normalText:"Yellow",inputType:"dropdown",
       options:["STRAW","LIGHT YELLOW","YELLOW","DARK YELLOW","COLORLESS","AMBER","ORANGE","RED"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"utransp",name:"Transparency",unit:"",normalText:"Clear",inputType:"dropdown",
       options:["CLEAR","SLIGHTLY HAZY","HAZY","CLOUDY","TURBID","MILKY"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"usp",name:"Specific Gravity",unit:"",normalMin:1.005,normalMax:1.030,normalText:"1.005 – 1.030",
       showUnit:false,showNormal:false,showFlag:false},
      {id:"uph",name:"pH",unit:"",normalText:"4.6 – 8.0",inputType:"dropdown",
       options:["5.0","6.0","6.50","7.0","7.50","8.0","9.0"],
       showUnit:false,showNormal:false,showFlag:false},
    ]},
    {group:"Chemical Examination",tests:[
      {id:"uprot",name:"Protein",unit:"",normalText:"Negative",inputType:"dropdown",
       options:["Negative","+","++","+++","++++","Trace"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"ugluc",name:"Glucose",unit:"",normalText:"Negative",inputType:"dropdown",
       options:["Negative","+","++","+++","++++","Trace"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"uketo",name:"Ketone",unit:"",normalText:"Negative",inputType:"dropdown",
       options:["Negative","+","++","+++","++++","Trace"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"ubld",name:"Blood",unit:"",normalText:"Negative",inputType:"dropdown",
       options:["Negative","+","++","+++","++++","Trace"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"uleuk",name:"Leukocytes",unit:"",normalText:"Negative",inputType:"dropdown",
       options:["Negative","+","++","+++","++++","Trace"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"ubili",name:"Bilirubin",unit:"",normalText:"Negative",inputType:"dropdown",
       options:["Negative","+","++","+++","++++","Trace"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"unitrite",name:"Nitrite",unit:"",normalText:"Negative",inputType:"dropdown",
       options:["Negative","+","++","+++","++++","Trace"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"uurobili",name:"Urobilinogen",unit:"",normalText:"Negative",inputType:"dropdown",
       options:["Negative","+","++","+++","++++","Trace"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"uothers_chem",name:"Others",unit:"",normalText:"",
       showUnit:false,showNormal:false,showFlag:false},
    ]},
    {group:"Microscopic Examination",tests:[
      {id:"uwbc",name:"Pus Cells",unit:"/hpf",normalText:"0 – 5",showUnit:true,showNormal:false,showFlag:false},
      {id:"urbc",name:"Red Cells",unit:"/hpf",normalText:"0 – 3",showUnit:true,showNormal:false,showFlag:false},
      {id:"uep",name:"Epithelial Cells",unit:"/lpf",normalText:"Few",inputType:"dropdown",
       options:["FEW","RARE","MODERATE","OCCASSIONAL","ABUNDANT","NONE"],
       showUnit:true,showNormal:false,showFlag:false},
      {id:"ubact",name:"Bacteria",unit:"",normalText:"None",inputType:"dropdown",
       options:["FEW","RARE","MODERATE","OCCASSIONAL","ABUNDANT","NONE"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"umucus",name:"Mucus Thread",unit:"",normalText:"None",inputType:"dropdown",
       options:["FEW","RARE","MODERATE","OCCASSIONAL","ABUNDANT","NONE"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"ucryst",name:"Crystals",unit:"",normalText:"None",inputType:"dropdown",
       options:["AMORPHOUS - FEW","AMORPHOUS - RARE","AMORPHOUS - MODERATE","AMORPHOUS - OCCASSIONAL","AMORPHOUS - ABUNDANT",
                "URIC ACID - FEW","URIC ACID - RARE","URIC ACID - MODERATE","URIC ACID - OCCASSIONAL","URIC ACID - ABUNDANT",
                "CALCIUM OX - FEW","CALCIUM OX - RARE","CALCIUM OX - MODERATE","CALCIUM OX - OCCASSIONAL","CALCIUM OX - ABUNDANT",
                "TRIPLE PHOS - FEW","TRIPLE PHOS - RARE","TRIPLE PHOS - MODERATE","TRIPLE PHOS - OCCASSIONAL","TRIPLE PHOS - ABUNDANT",
                "CALCIUM CARB - FEW","CALCIUM CARB - RARE","CALCIUM CARB - MODERATE","CALCIUM CARB - OCCASSIONAL","CALCIUM CARB - ABUNDANT",
                "NONE"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"ucasts",name:"Casts",unit:"/lpf",normalText:"None",inputType:"dropdown",
       options:["Coarse Granular","Fine Granular","WBC","RBC","HYALINE","WAXY","NONE"],
       showUnit:true,showNormal:false,showFlag:false,showCount:true},
      {id:"uothers",name:"Others",unit:"",normalText:"None",showUnit:false,showNormal:false,showFlag:false},
    ]},
  ],
  serology:[
    {group:"Hepatitis Markers",tests:[
      {id:"hbsag",name:"HBsAg",unit:"",normalText:"Non-reactive",inputType:"dropdown",
       options:["NON-REACTIVE","REACTIVE"]},
    ]},
    {group:"Infectious Disease",tests:[
      {id:"typhigm",name:"Typhidot IgM",unit:"",normalText:"Negative",inputType:"dropdown",
       options:["Positive","Negative"],showBrand:true,brands:["CTK","INTEC"]},
      {id:"typhigg",name:"Typhidot IgG",unit:"",normalText:"Negative",inputType:"dropdown",
       options:["Negative","Positive"]},
      {id:"vdrl",name:"VDRL / RPR",unit:"",normalText:"Non-reactive",inputType:"dropdown",
       options:["NON-REACTIVE","REACTIVE"]},
      {id:"hiv",name:"HIV 1 & 2",unit:"",normalText:"Non-reactive",inputType:"dropdown",
       options:["NON-REACTIVE","REACTIVE"]},
      {id:"dengue",name:"Dengue NS1",unit:"",normalText:"Negative",inputType:"dropdown",
       options:["Negative","Positive"]},
    ]},
    {group:"Pregnancy / Hormones",tests:[
      {id:"preg",name:"Pregnancy Test (hCG)",unit:"",normalText:"Negative",inputType:"dropdown",
       options:["Negative","Positive"],showBrand:true,brands:["CTK","Partners","Sure-Guard","ADVAN"]},
      {id:"tsh",name:"TSH",unit:"mIU/L",normalMin:0.4,normalMax:4.0,normalText:"0.4 – 4.0"},
      {id:"ft4",name:"Free T4",unit:"ng/dL",normalMin:0.8,normalMax:1.8,normalText:"0.8 – 1.8"},
    ]},
  ],
  bloodtyping:[
    {group:"Blood Typing",tests:[
      {id:"abo",name:"ABO Blood Type",unit:"",normalText:"A / B / AB / O",inputType:"dropdown",
       options:["A","B","O","AB"]},
      {id:"rh",name:"Rh Factor",unit:"",normalText:"Positive / Negative",inputType:"dropdown",
       options:["POSITIVE","NEGATIVE"]},
      {id:"crossmatch",name:"Cross Match",unit:"",normalText:"Compatible",inputType:"dropdown",
       options:["Compatible","Incompatible"]},
    ]},
  ],
  fecalysis:[
    {group:"Macroscopic",tests:[
      {id:"fcolor",name:"Color",unit:"",normalText:"Brown",inputType:"dropdown",
       options:["YELLOW","YELLOW BROWN","BROWN","GREEN","YELLOW GREEN","BLACK"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"fconsist",name:"Consistency",unit:"",normalText:"Formed",inputType:"dropdown",
       options:["MUSHY","SOFT","FORMED","SEMI-FORMED","WATERY","HARD","MUCOID"],
       showUnit:false,showNormal:false,showFlag:false},
    ]},
    {group:"Microscopic",tests:[
      {id:"fpus",name:"Pus Cells",unit:"/hpf",normalText:"None",showUnit:true,showNormal:false,showFlag:false},
      {id:"frbc",name:"Red Cells",unit:"/hpf",normalText:"None",showUnit:true,showNormal:false,showFlag:false},
      {id:"ffat",name:"Fat Globules",unit:"",normalText:"None",inputType:"dropdown",
       options:["FEW","RARE","MODERATE","OCCASSIONAL","ABUNDANT","NONE"],
       showUnit:false,showNormal:false,showFlag:false},
    ]},
    {group:"Parasitology",tests:[
      {id:"fascaris",name:"Ascaris",unit:"",normalText:"No Ova of Parasite Seen",inputType:"dropdown",
       options:["NO OVA OF PARASITE SEEN","Seen"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"ftrich",name:"Trichuris",unit:"",normalText:"No Ova of Parasite Seen",inputType:"dropdown",
       options:["NO OVA OF PARASITE SEEN","Seen"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"fhook",name:"Hookworm",unit:"",normalText:"No Ova of Parasite Seen",inputType:"dropdown",
       options:["NO OVA OF PARASITE SEEN","Seen"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"famoeba",name:"Amoeba",unit:"",normalText:"None Seen",inputType:"dropdown",
       options:["NONE SEEN","Cyst Seen","Trophozoites Seen"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"fflagel",name:"Flagellates",unit:"",normalText:"None",inputType:"dropdown",
       options:["NONE","Giardia lamblia","Trichomonas hominis"],
       showUnit:false,showNormal:false,showFlag:false},
      {id:"fothers",name:"Others",unit:"",normalText:"None",showUnit:false,showNormal:false,showFlag:false},
    ]},
  ],
  microbiology:[
    {group:"KOH: Stool",tests:[
      {id:"koh_stool",name:"KOH",unit:"",normalText:"",inputType:"dropdown",
       options:[
         "POSITIVE FOR BUDDING YEAST CELLS",
         "POSITIVE FOR NONBUDDING YEAST CELLS",
         "POSITIVE FOR BUDDING YEAST CELLS WITH HYPHAE",
         "POSITIVE FOR BUDDING AND NONBUDDING YEAST CELLS",
         "POSITIVE FOR BUDDING AND NONBUDDING YEAST CELLS WITH HYPHAE",
         "NEGATIVE FOR FUNGAL ELEMENTS",
       ],
       showUnit:false,showNormal:false,showFlag:false},
    ]},
  ],
  coagulation:[
    {group:"Coagulation Studies",tests:[
      {id:"pt",   name:"Prothrombin Time (PT)",     unit:"sec",normalMin:11,normalMax:14,normalText:"11 – 14"},
      {id:"aptt", name:"Activated Partial Thromboplastin Time (APTT)", unit:"sec",normalMin:25,normalMax:35,normalText:"25 – 35"},
    ]},
  ],
  othertests:[
    {group:"Other Tests",tests:[
      {id:"esr",name:"ESR",unit:"mm/hr",normalMin:0,normalMax:20,normalText:"0 – 20"},
    ]},
  ],
};

/* ─── Section header colors for PDF ─── */
const SECTION_COLORS={
  hematology:[192,57,43],
  bloodchem: [231,84,128],
  urinalysis:[240,210,100],
  serology:  [22,160,133],
  bloodtyping:[231,76,60],
  fecalysis: [41,128,185],
  microbiology:[142,68,173],
  coagulation:[127,140,141],
  othertests:[26,188,156],
};

/* ─── Template Editor Constants ─── */
const PRESET_COLORS = [
  "#c0392b","#e74c3c","#e75480","#d35400","#e67e22","#f39c12",
  "#c8a800","#27ae60","#2ecc71","#16a085","#1abc9c","#2e86ab",
  "#2980b9","#3498db","#1d4ed8","#6c3483","#8e44ad","#7c3aed",
  "#7f8c8d","#34495e","#2c3e50","#1a1a2e","#6b4226","#0e4d45",
];
const DEFAULT_SIGS = {
  lab:[
    {role:"Performed By",field:"medtech",showLic:true},
    {role:"Validated By",field:"validatedBy",showLic:true},
    {role:"Pathologist",field:"pathologist",showLic:true},
  ],
};
const defaultBlocks = (sLabel) => ({
  clinicHeader: { y:10, fontSize:14, color:"#000000", bold:true, align:"center" },
  deptLabel:    { y:50, fontSize:10, color:"#555555", bold:false, align:"center" },
  addressLine:  { y:64, fontSize:9,  color:"#888888", bold:false, align:"center" },
  phoneLine:    { y:76, fontSize:9,  color:"#888888", bold:false, align:"center" },
  reportTitle:  { y:100, fontSize:13, color:null, bold:true, align:"center", text:(sLabel||"").toUpperCase()+" REPORT" },
  patientInfo:  { y:130, fontSize:10 },
  resultsTable: { y:220, fontSize:9, rowSpacing:1.6 },
  signatures:   { y:520 },
});

/* ─── Template Storage ─── */
let _templates = dbLoad("lims_templates",{lab:{}});
const saveTemplates = (tpl) => { _templates = tpl; dbSave("lims_templates", tpl); };
const getTemplate = (sectionId) => {
  const deptTpl = _templates.lab || {};
  if(sectionId && deptTpl[sectionId]) return deptTpl[sectionId];
  if(deptTpl._master) return deptTpl._master;
  return null;
};

/* ─── PDF Download — uses template block positions/fonts from editor ─── */
async function downloadResultAsPDF(result, patient, hospitalInfo, silent=false, staff=[]) {
  const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"legal"});
  const W=215.9, H=355.6;
  const navy=[0,0,0], grey=[60,60,60], black=[0,0,0];
  const dateTime=result.date&&result.time?`${fmtDate(result.date)}, ${result.time}`:result.date?fmtDate(result.date):"—";

  // ── Load saved template settings ──
  const secId = (result.section||"").toLowerCase();
  const tpl = getTemplate(secId) || {};
  const hexToRgb = (hex) => { if(!hex||hex[0]!=="#") return null; return [parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)]; };
  const clinicName = tpl.clinicName || hospitalInfo?.name || "CLINICAL LABORATORY";
  const deptName = tpl.deptName || "Laboratory Department";
  const address = tpl.address || hospitalInfo?.address || "";
  const phone = tpl.phone || hospitalInfo?.phone || "";
  const showAddress = tpl.showAddress !== false;
  const showPhone = tpl.showPhone !== false;
  const tplColor = tpl.sectionColor ? hexToRgb(tpl.sectionColor) : null;
  const reportTitle = tpl.reportTitle || ((result.sectionLabel||"").toUpperCase()+" REPORT");

  // ── Template block positions & fonts (preview px → mm) ──
  // Preview is 500×824px (8.5:14 ratio). Top half = 412px = 177.8mm on paper.
  const HALF = 177.8;
  const PX2MM_Y = HALF/412;  // ≈0.431 — maps preview top-half 412px → 177.8mm
  const PX2MM_X = W/500;     // ≈0.432
  const B = tpl.blocks || {};
  const bGet = (key, field, fallback) => B[key]?.[field] ?? fallback;
  // Convert preview Y px to mm
  const yMM = (key, fallback) => bGet(key, "y", fallback) * PX2MM_Y;
  // Font sizes: template stores in preview px, convert to PDF pt (rough 1:1 for small sizes, scale slightly)
  const fsMM = (key, fallback) => bGet(key, "fontSize", fallback);
  const bAlign = (key, fallback) => bGet(key, "align", fallback);
  const bBold = (key, fallback) => bGet(key, "bold", fallback);
  const bColor = (key, fallback) => { const c=bGet(key,"color",null); return c?hexToRgb(c):fallback; };

  // ── Floating images (behind text) ──
  const floatImgs = tpl.floatImages || [];
  floatImgs.filter(fi=>fi.behindText).forEach(fi=>{
    try{ doc.addImage(fi.src,"AUTO",fi.x*PX2MM_X,fi.y*PX2MM_Y,fi.width*PX2MM_X,fi.height*PX2MM_Y); }catch(e){}
  });

  // ── HEADER — uses block positions from template ──
  const alignMap = (a) => a==="left"?"left":a==="right"?"right":"center";
  const alignX = (a) => a==="left"?10:a==="right"?W-10:W/2;

  // Clinic Name
  {const fs=fsMM("clinicHeader",14), al=bAlign("clinicHeader","center"), bd=bBold("clinicHeader",true), col=bColor("clinicHeader",navy);
  doc.setFont("times",bd?"bold":"normal");doc.setFontSize(fs);doc.setTextColor(...col);
  doc.text(clinicName,alignX(al),yMM("clinicHeader",10),{align:alignMap(al)});}

  // Dept Label
  {const fs=fsMM("deptLabel",10), al=bAlign("deptLabel","center"), bd=bBold("deptLabel",false), col=bColor("deptLabel",grey);
  doc.setFont("times",bd?"bold":"normal");doc.setFontSize(fs);doc.setTextColor(...col);
  doc.text(deptName,alignX(al),yMM("deptLabel",50),{align:alignMap(al)});}

  // Address
  if(showAddress&&address){
    const fs=fsMM("addressLine",9), al=bAlign("addressLine","center"), col=bColor("addressLine",grey);
    doc.setFont("times","normal");doc.setFontSize(fs);doc.setTextColor(...col);
    doc.text(address,alignX(al),yMM("addressLine",64),{align:alignMap(al)});
  }

  // Phone
  if(showPhone&&phone){
    const fs=fsMM("phoneLine",9), al=bAlign("phoneLine","center"), col=bColor("phoneLine",grey);
    doc.setFont("times","normal");doc.setFontSize(fs);doc.setTextColor(...col);
    doc.text("Tel: "+phone,alignX(al),yMM("phoneLine",76),{align:alignMap(al)});
  }

  // Report Title
  {const fs=fsMM("reportTitle",13), al=bAlign("reportTitle","center"), bd=bBold("reportTitle",true);
  const col=bColor("reportTitle",null)||tplColor||SECTION_COLORS[result.section||""]||navy;
  doc.setFont("times",bd?"bold":"normal");doc.setFontSize(fs);doc.setTextColor(...col);
  doc.text(reportTitle,alignX(al),yMM("reportTitle",100),{align:alignMap(al)});}

  // Divider line just below report title
  const divY = yMM("reportTitle",100)+3;
  doc.setDrawColor(0,0,0);doc.setLineWidth(0.6);doc.line(8,divY,W-8,divY);

  // ── PATIENT INFO — positioned by patientInfo block ──
  const piY = yMM("patientInfo",130);
  const piFS = fsMM("patientInfo",10);
  doc.setFont("times","normal");doc.setFontSize(piFS);
  const dob=patient?.dob?new Date(patient.dob).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}):"—";
  const meta=[
    ["Patient Name:",patient?.name||"—","Date & Time:",dateTime],
    ["Age / Sex:",(calcAge(patient?.dob)||"—")+" / "+(patient?.gender||"—"),"Ward:",result.ward||"—"],
    ["Date of Birth:",dob,"Physician:",result.physician||"—"],
  ];
  let my=piY;
  meta.forEach(row=>{
    doc.setFont("times","normal");doc.setTextColor(...grey);doc.text(row[0],10,my);
    doc.setFont("times","bold");doc.setTextColor(...black);doc.text(row[1],44,my);
    if(row[2]){doc.setFont("times","normal");doc.setTextColor(...grey);doc.text(row[2],W/2+4,my);}
    if(row[3]){doc.setFont("times","bold");doc.setTextColor(...black);doc.text(row[3],W/2+40,my);}
    my+=piFS*0.42;
  });
  doc.setDrawColor(180,180,180);doc.setLineWidth(0.3);doc.line(8,my,W-8,my);

  // ── Watermark logo ──
  const SIG_Y = yMM("signatures",520);
  if(hospitalInfo?.showLogoInPDF&&hospitalInfo?.logoUri){
    try{
      const ls=75;
      const centerY=my+((SIG_Y-my)/2);
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({opacity:0.08}));
      doc.addImage(hospitalInfo.logoUri,"",(W-ls)/2,centerY-(ls/2),ls,ls,"","FAST");
      doc.restoreGraphicsState();
    }catch(e){}
  }

  // ── RESULTS TABLE — positioned by resultsTable block ──
  let y = yMM("resultsTable",220);
  const tblFS = fsMM("resultsTable",9);
  const tblRowSpacing = bGet("resultsTable","rowSpacing",1.6);
  const sc = tplColor||SECTION_COLORS[result.section||""]||[0,0,0];
  const isUrinalysis=(result.section||"").toLowerCase()==="urinalysis";
  const isFecalysis=(result.section||"").toLowerCase()==="fecalysis";

  if(isFecalysis){
    const macroKeys=["color","consistency"];
    const microKeys=["pus cells","red cells","fat globules","flagellates","others"];
    const macroRows=result.lines.filter(l=>macroKeys.some(k=>l.testName.toLowerCase().includes(k)));
    const microRows=result.lines.filter(l=>microKeys.some(k=>l.testName.toLowerCase().includes(k)));
    const caught=new Set([...macroRows,...microRows].map(l=>l.testName));
    const paraRows=result.lines.filter(l=>!caught.has(l.testName));
    const colW=(W-22)/2;
    const leftX=8,rightX=W/2+3;
    let lY=y,rY=y;
    const fStyle={font:"times",fontSize:tblFS,cellPadding:1.2,textColor:black,fillColor:false};
    const dpc=(d)=>{if(d.section==="head")d.cell.styles.halign=d.column.index===0?"left":"center";};
    if(macroRows.length>0){
      doc.setFont("times","bold");doc.setFontSize(tblFS-2);doc.setTextColor(...black);doc.text("MACROSCOPIC",leftX,lY);lY+=2.5;
      doc.autoTable({startY:lY,head:[["Test","Result"]],body:macroRows.map(l=>[l.testName,l.value||""]),
        margin:{left:leftX,right:W-leftX-colW},tableWidth:colW,pageBreak:"avoid",
        styles:fStyle,headStyles:{fillColor:sc,textColor:[255,255,255],fontStyle:"bold",fontSize:tblFS-1},
        columnStyles:{0:{cellWidth:colW*0.55,halign:"left"},1:{cellWidth:colW*0.45,halign:"center",fontStyle:"bold"}},
        didParseCell:dpc,alternateRowStyles:{fillColor:false}});
      lY=doc.lastAutoTable.finalY+2.5;
    }
    if(microRows.length>0){
      doc.setFont("times","bold");doc.setFontSize(tblFS-2);doc.setTextColor(...black);doc.text("MICROSCOPIC",leftX,lY);lY+=2.5;
      doc.autoTable({startY:lY,head:[["Test","Result","Unit"]],body:microRows.map(l=>[l.testName,l.value||"",l.unit||""]),
        margin:{left:leftX,right:W-leftX-colW},tableWidth:colW,pageBreak:"avoid",
        styles:fStyle,headStyles:{fillColor:sc,textColor:[255,255,255],fontStyle:"bold",fontSize:tblFS-2},
        columnStyles:{0:{cellWidth:colW*0.54,halign:"left"},1:{cellWidth:colW*0.28,halign:"center",fontStyle:"bold"},2:{cellWidth:colW*0.18,halign:"center",textColor:grey}},
        didParseCell:dpc,alternateRowStyles:{fillColor:false}});
      lY=doc.lastAutoTable.finalY+2.5;
    }
    if(paraRows.length>0){
      doc.setFont("times","bold");doc.setFontSize(tblFS-2);doc.setTextColor(...black);doc.text("PARASITOLOGY",rightX,rY);rY+=2.5;
      doc.autoTable({startY:rY,head:[["Test","Result"]],body:paraRows.map(l=>[l.testName,l.value||""]),
        margin:{left:rightX,right:10},tableWidth:colW,pageBreak:"avoid",
        styles:{...fStyle,fontSize:tblFS},headStyles:{fillColor:sc,textColor:[255,255,255],fontStyle:"bold",fontSize:tblFS-2},
        columnStyles:{0:{cellWidth:colW*0.38,halign:"left"},1:{cellWidth:colW*0.62,fontStyle:"bold"}},
        didParseCell:dpc,alternateRowStyles:{fillColor:false}});
    }
  } else if(isUrinalysis){
    const FS=tblFS,HFS=tblFS-0.5,PAD=1.1,GAP=1.8;
    const physicalKeys=["color","transparency","specific gravity","ph"];
    const chemKeys=["protein","glucose","ketone","blood","leukocyte","bilirubin","nitrite","urobilinogen"];
    const physRows=result.lines.filter(l=>physicalKeys.some(k=>l.testName.toLowerCase().includes(k)));
    const chemRows=result.lines.filter(l=>chemKeys.some(k=>l.testName.toLowerCase().includes(k)));
    const caught=new Set([...physRows,...chemRows].map(l=>l.testName));
    const microRows=result.lines.filter(l=>!caught.has(l.testName));
    const colW=(W-22)/2;
    const leftX=8,rightX=W/2+3;
    let lY=y,rY=y;
    const baseS={font:"times",fontSize:FS,cellPadding:PAD,textColor:black,fillColor:false};
    const hs=()=>({fillColor:sc,textColor:[255,255,255],fontStyle:"bold",fontSize:HFS});
    const dpc=(d)=>{if(d.section==="head")d.cell.styles.halign=d.column.index===0?"left":"center";};
    if(physRows.length>0){
      doc.setFont("times","bold");doc.setFontSize(FS);doc.setTextColor(...black);doc.text("I. PHYSICAL EXAMINATION",leftX,lY);lY+=1.8;
      doc.autoTable({startY:lY,head:[["Test","Result"]],body:physRows.map(l=>[l.testName,l.value||""]),
        margin:{left:leftX,right:W-leftX-colW},tableWidth:colW,pageBreak:"avoid",
        styles:baseS,headStyles:hs(),
        columnStyles:{0:{cellWidth:colW*0.62,halign:"left"},1:{cellWidth:colW*0.38,halign:"center",fontStyle:"bold"}},
        didParseCell:dpc,alternateRowStyles:{fillColor:false}});
      lY=doc.lastAutoTable.finalY+GAP;
    }
    if(chemRows.length>0){
      doc.setFont("times","bold");doc.setFontSize(FS);doc.setTextColor(...black);doc.text("II. CHEMICAL EXAMINATION",leftX,lY);lY+=1.8;
      doc.autoTable({startY:lY,head:[["Test","Result"]],body:chemRows.map(l=>[l.testName,l.value||""]),
        margin:{left:leftX,right:W-leftX-colW},tableWidth:colW,pageBreak:"avoid",
        styles:baseS,headStyles:hs(),
        columnStyles:{0:{cellWidth:colW*0.62,halign:"left"},1:{cellWidth:colW*0.38,halign:"center",fontStyle:"bold"}},
        didParseCell:dpc,alternateRowStyles:{fillColor:false}});
      lY=doc.lastAutoTable.finalY+GAP;
    }
    if(microRows.length>0){
      doc.setFont("times","bold");doc.setFontSize(FS);doc.setTextColor(...black);doc.text("III. MICROSCOPIC EXAMINATION",rightX,rY);rY+=1.8;
      doc.autoTable({startY:rY,head:[["Test","Result","Unit"]],
        body:microRows.map(l=>[l.testName,l.value||"",l.testName.toLowerCase().includes("epithelial")?"":l.unit||""]),
        margin:{left:rightX,right:8},tableWidth:colW,pageBreak:"avoid",
        styles:{...baseS,overflow:"linebreak"},headStyles:hs(),
        columnStyles:{0:{cellWidth:colW*0.40,halign:"left"},1:{cellWidth:colW*0.44,halign:"center",fontStyle:"bold"},2:{cellWidth:colW*0.16,halign:"center",textColor:grey}},
        didParseCell(data){
          if(data.section==="head")data.cell.styles.halign=data.column.index===0?"left":"center";
          if(data.section==="body"&&data.column.index===1){
            const tn=(microRows[data.row.index]?.testName||"").toLowerCase();
            if(tn.includes("crystal")||tn.includes("cast")){data.cell.styles.fontSize=tblFS-2;data.cell.styles.overflow="linebreak";}
          }
        },
        alternateRowStyles:{fillColor:false}});
    }
  } else if(secId==="bloodtyping") {
    // ── Blood Typing: show as combined "A+" format, not separate table rows ──
    const aboLine=result.lines.find(l=>(l.testId||"").toLowerCase()==="abo"||(l.testName||"").toLowerCase().includes("abo"));
    const rhLine=result.lines.find(l=>(l.testId||"").toLowerCase()==="rh"||(l.testName||"").toLowerCase().includes("rh"));
    const crossLine=result.lines.find(l=>(l.testId||"").toLowerCase()==="crossmatch"||(l.testName||"").toLowerCase().includes("cross"));
    const aboVal=aboLine?.value||"";
    const rhVal=rhLine?.value||"";
    const rhSymbol=rhVal.toUpperCase()==="POSITIVE"?"+":rhVal.toUpperCase()==="NEGATIVE"?"−":rhVal;
    const combined=aboVal+rhSymbol;
    // Draw blood type big
    const btY=y+8;
    doc.setFont("times","bold");doc.setFontSize(28);doc.setTextColor(...sc);
    doc.text("Blood Type:  "+combined,W/2,btY,{align:"center"});
    let btYY=btY+12;
    doc.setFont("times","normal");doc.setFontSize(tblFS+1);doc.setTextColor(...grey);
    doc.text("ABO Group: "+aboVal+"          Rh Factor: "+rhVal,W/2,btYY,{align:"center"});
    btYY+=6;
    if(crossLine){
      doc.setFont("times","normal");doc.setFontSize(tblFS+1);doc.setTextColor(...black);
      doc.text("Cross Match: "+(crossLine.value||""),W/2,btYY,{align:"center"});
    }
  } else {
    // ── Generic table — with group headers for chemistry/serology ──
    const hasGroups=result.lines.some(l=>l.groupName);
    const anyUnit=result.lines.some(l=>l.showUnit!==false);
    const anyNormal=result.lines.some(l=>l.showNormal!==false);
    const anyFlag=result.lines.some(l=>l.showFlag!==false);
    const headCols=["TEST","RESULT"];
    if(anyUnit)headCols.push("UNIT");
    if(anyNormal)headCols.push("NORMAL VALUES");
    if(anyFlag)headCols.push("FLAG");

    // Build body rows with group separator rows
    const bodyRows=[];
    const groupRowIndices=new Set();
    let lastGroup="";
    result.lines.forEach((l,idx)=>{
      if(hasGroups&&l.groupName&&l.groupName!==lastGroup){
        // Insert a group header row
        const gRow=[l.groupName];
        for(let ci=1;ci<headCols.length;ci++) gRow.push("");
        groupRowIndices.add(bodyRows.length);
        bodyRows.push(gRow);
        lastGroup=l.groupName;
      }
      const row=[l.testName+(l.showBrand&&l.brand?" ("+l.brand+")":""),l.value||""];
      if(anyUnit)row.push(l.showUnit!==false?(l.unit||""):"");
      if(anyNormal)row.push(l.showNormal!==false?(l.normalRange||""):"");
      if(anyFlag)row.push(l.showFlag!==false?(l.flag||""):"");
      bodyRows.push(row);
    });
    const usable=W-16;
    const fixed=(anyUnit?16:0)+(anyNormal?48:0)+(anyFlag?16:0);
    const resultW=anyUnit||anyNormal||anyFlag?46:Math.round(usable*(2/3));
    const testWfinal=usable-resultW-fixed;
    const colStyles={0:{cellWidth:testWfinal,halign:"left"},1:{cellWidth:resultW,halign:"center",fontStyle:"bold"}};
    let ci=2;
    if(anyUnit){colStyles[ci]={cellWidth:16,halign:"center",textColor:grey};ci++;}
    if(anyNormal){colStyles[ci]={cellWidth:48,halign:"center",textColor:[0,0,0]};ci++;}
    if(anyFlag){colStyles[ci]={cellWidth:16,halign:"center",fontStyle:"bold"};}
    const flagColIdx=anyFlag?(1+(anyUnit?1:0)+(anyNormal?1:0)+1):null;
    // Track which data rows are actual test rows (not group headers) for indentation
    const testRowIndices=new Set();
    for(let ri=0;ri<bodyRows.length;ri++){if(!groupRowIndices.has(ri))testRowIndices.add(ri);}
    const indentTests=hasGroups; // only indent if there are group headers

    doc.autoTable({
      startY:y,head:[headCols],body:bodyRows,margin:{left:8,right:8},pageBreak:"avoid",
      styles:{font:"times",fontSize:tblFS+0.5,cellPadding:tblRowSpacing,textColor:black,fillColor:false},
      headStyles:{fillColor:sc,textColor:[255,255,255],fontStyle:"bold",fontSize:tblFS},
      columnStyles:colStyles,
      didParseCell(data){
        if(data.section==="head"&&data.column.index===0)data.cell.styles.halign="left";
        if(data.section==="head"&&data.column.index>=1)data.cell.styles.halign="center";
        // Style group header rows — transparent background so watermark shows through
        if(data.section==="body"&&groupRowIndices.has(data.row.index)){
          data.cell.styles.fontStyle="bold";
          data.cell.styles.fontSize=tblFS;
          data.cell.styles.textColor=sc;
          data.cell.styles.fillColor=false;
          data.cell.styles.cellPadding={top:tblRowSpacing+1,bottom:tblRowSpacing*0.3,left:1.5,right:1.5};
          if(data.column.index>0){data.cell.text=[""];}
          if(data.column.index===0){data.cell.colSpan=headCols.length;}
        }
        // Indent test names under group headers
        if(indentTests&&data.section==="body"&&data.column.index===0&&testRowIndices.has(data.row.index)){
          data.cell.styles.cellPadding={top:tblRowSpacing,bottom:tblRowSpacing,left:6,right:1.5};
        }
        if(flagColIdx!==null&&data.section==="body"&&data.column.index===flagColIdx&&!groupRowIndices.has(data.row.index)){
          const f=data.cell.raw;
          if(f==="HI")data.cell.styles.textColor=[192,57,43];
          else if(f==="LO")data.cell.styles.textColor=[26,111,181];
        }
        if(data.section==="body"&&data.column.index===1&&!groupRowIndices.has(data.row.index)){
          const f=flagColIdx!==null?bodyRows[data.row.index]?.[flagColIdx]:"";
          if(f==="HI")data.cell.styles.textColor=[192,57,43];
          else if(f==="LO")data.cell.styles.textColor=[26,111,181];
        }
      },
      alternateRowStyles:{fillColor:false},
    });
  }

  // ── REMARKS — printed above signatures for chem/hema/serology ──
  if(result.remark && (result.section==="bloodchem"||result.section==="hematology"||result.section==="serology")){
    const remarkTableY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 3 : SIG_Y - 20;
    const remarkY = Math.min(remarkTableY, SIG_Y - 14);
    doc.setFont("times","bold"); doc.setFontSize(8); doc.setTextColor(...black);
    doc.text("REMARKS:", 8, remarkY);
    doc.setFont("times","italic"); doc.setFontSize(8); doc.setTextColor(...grey);
    const remarkLines = doc.splitTextToSize(result.remark, W - 30);
    doc.text(remarkLines, 28, remarkY);
  }

  // ── SIGNATURES — positioned by signatures block ──
  const sigFS = fsMM("signatures",8);
  const tplSigs = tpl.signatures;
  const getEsig=(name)=>{
    if(!name||!staff||!staff.length)return null;
    return staff.find(s=>s.name===name)?.eSignature||null;
  };
  const ESIG_W=44, ESIG_H=16;
  if(tplSigs && tplSigs.length > 0) {
    tplSigs.forEach((sig,i) => {
      const x = tplSigs.length===1 ? W*0.5 : tplSigs.length===2 ? (i===0?W*0.28:W*0.72) : (i===0?W*0.22:i===1?W*0.5:W*0.78);
      const name = result[sig.field] || "";
      const lic = result[sig.field+"Lic"] || "";
      doc.setDrawColor(...black);doc.setLineWidth(0.4);doc.line(x-28,SIG_Y,x+28,SIG_Y);
      const esigSrc=getEsig(name);
      if(esigSrc&&name){ try{doc.addImage(esigSrc,"AUTO",x-ESIG_W/2,SIG_Y-ESIG_H*0.6,ESIG_W,ESIG_H);}catch(e){} }
      doc.setFont("times","bold");doc.setFontSize(sigFS);doc.setTextColor(...navy);
      doc.text(name||"________________________",x,SIG_Y+3,{align:"center"});
      if(sig.showLic&&lic){doc.setFont("times","normal");doc.setFontSize(sigFS-1);doc.setTextColor(...grey);doc.text("Lic. No. "+lic,x,SIG_Y+6,{align:"center"});}
      doc.setFont("times","normal");doc.setFontSize(sigFS-1);doc.setTextColor(...grey);
      doc.text(sig.role.toUpperCase(),x,(sig.showLic&&lic)?SIG_Y+9:SIG_Y+6.5,{align:"center"});
    });
  } else {
    // Default fallback: 3-signature layout — Performed By, Validated By, Pathologist
    const fallbackSigs = [
      {field:"medtech",licField:"medtechLic",role:"PERFORMED BY"},
      {field:"validatedBy",licField:"validatedByLic",role:"VALIDATED BY"},
      {field:"pathologist",licField:"pathologistLic",role:"PATHOLOGIST"},
    ];
    fallbackSigs.forEach((sig,i)=>{
      const x=i===0?W*0.22:i===1?W*0.5:W*0.78;
      const name=result[sig.field]||"";
      const lic=result[sig.licField]?"Lic. No. "+result[sig.licField]:"";
      doc.setDrawColor(...black);doc.setLineWidth(0.4);doc.line(x-26,SIG_Y,x+26,SIG_Y);
      const esigSrc=getEsig(name);
      if(esigSrc&&name){ try{doc.addImage(esigSrc,"AUTO",x-ESIG_W/2,SIG_Y-ESIG_H*0.6,ESIG_W,ESIG_H);}catch(e){} }
      doc.setFont("times","bold");doc.setFontSize(sigFS);doc.setTextColor(...navy);
      doc.text(name||"________________________",x,SIG_Y+3,{align:"center"});
      if(lic){doc.setFont("times","normal");doc.setFontSize(sigFS-1);doc.setTextColor(...grey);doc.text(lic,x,SIG_Y+6,{align:"center"});}
      doc.setFont("times","normal");doc.setFontSize(sigFS-1);doc.setTextColor(...grey);
      doc.text(sig.role,x,lic?SIG_Y+9:SIG_Y+6.5,{align:"center"});
    });
  }

  // ── Floating images (on top) & texts ──
  floatImgs.filter(fi=>!fi.behindText).forEach(fi=>{
    try{ doc.addImage(fi.src,"AUTO",fi.x*PX2MM_X,fi.y*PX2MM_Y,fi.width*PX2MM_X,fi.height*PX2MM_Y); }catch(e){}
  });
  (tpl.floatTexts||[]).forEach(ft=>{
    doc.setFont("times",ft.bold?"bold":"normal");
    doc.setFontSize(ft.fontSize||10);
    const ftc=ft.color?hexToRgb(ft.color):black;
    doc.setTextColor(...(ftc||black));
    doc.text(ft.text||"",ft.x*PX2MM_X,ft.y*PX2MM_Y);
  });



  // ── Save ──
  const safeName=(patient?.name||"Unknown").replace(/[^a-zA-Z0-9]/g,"_");
  const safeDate=(result.date||"").replace(/-/g,"");
  const sec=(result.sectionLabel||result.section||"Lab").replace(/\s+/g,"_");
  const filename=`${sec}_${safeName}_${safeDate}.pdf`;

  // Auto-save and open in built-in viewer (Electron)
  if(window.electronAPI && window.electronAPI.savePDF){
    const base64=doc.output("datauristring").split(",")[1];
    const saved=await window.electronAPI.savePDF(filename,base64);
    if(saved.success){
      if(silent && window.electronAPI.silentPrintPDF){
        // Batch print: send directly to printer, no viewer window opens
        await window.electronAPI.silentPrintPDF(saved.filePath);
      } else {
        // Single print: open in built-in PDF viewer
        await window.electronAPI.printPDF(saved.filePath, filename);
      }
    }
  } else {
    // Fallback for browser/LAN version
    const dataUri=doc.output("datauristring");
    const a=document.createElement("a");
    a.href=dataUri;
    a.download=filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}


/* ─── Searchable Patient Combobox ─── */
function PatientCombo({patients,value,onChange}){
  const [q,setQ]=useState("");
  const [open,setOpen]=useState(false);
  const ref=useRef();
  const inputRef=useRef();
  const sel=patients.find(p=>p.id===value);
  // Only update q from value when value actually changes to a valid patient
  const prevVal=useRef(value);
  useEffect(()=>{
    if(value!==prevVal.current){
      prevVal.current=value;
      const p=patients.find(p2=>p2.id===value);
      if(p) setQ(`${p.name}  (${p.pid})`);
      else if(!value) setQ("");
    }
  },[value,patients]);

  // Close dropdown when clicking outside — use a timeout so click targets can receive focus first
  useEffect(()=>{
    const h=e=>{
      if(ref.current&&!ref.current.contains(e.target)){
        setTimeout(()=>setOpen(false),100);
      }
    };
    document.addEventListener("mousedown",h,false);
    return()=>document.removeEventListener("mousedown",h,false);
  },[]);

  const list=q.length>0&&!sel
    ?patients.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())||p.pid.toLowerCase().includes(q.toLowerCase()))
    :patients;
  return(
    <div ref={ref} style={{position:"relative",flex:1}}>
      <input ref={inputRef} value={q}
        onChange={e=>{setQ(e.target.value);setOpen(true);if(!e.target.value)onChange("");}}
        onFocus={()=>setOpen(true)}
        placeholder="Search by name or patient ID…"
        style={inp({flex:1,width:"100%"})}/>
      {open&&list.length>0&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",
          border:"1px solid #b0bec5",borderTop:"none",zIndex:999,maxHeight:180,overflowY:"auto",
          boxShadow:"0 4px 12px rgba(0,0,0,.15)",borderRadius:"0 0 4px 4px"}}>
          {list.slice(0,15).map(p=>(
            <div key={p.id} onMouseDown={()=>{onChange(p.id);setQ(`${p.name}  (${p.pid})`);setOpen(false);}}
              style={{padding:"6px 10px",cursor:"pointer",borderBottom:"1px solid #f0f0f0",
                display:"flex",gap:12,alignItems:"center",fontSize:12}}
              onMouseEnter={e=>e.currentTarget.style.background="#e8f4fd"}
              onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
              <span style={{color:"#1565c0",fontWeight:600,minWidth:80,fontFamily:"monospace",fontSize:11}}>{p.pid}</span>
              <span style={{flex:1,fontWeight:500}}>{p.name}</span>
              <span style={{color:"#78909c",fontSize:11}}>{p.gender} · {calcAge(p.dob)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Staff Dropdown ─── */
function StaffDrop({staff,roles,value,onChange,placeholder,width=220}){
  const opts=staff.filter(s=>roles.includes(s.role));
  const listId="sdl_"+roles.join("_").replace(/\s/g,"");
  // Simple text input + datalist — always typeable, shows staff suggestions
  const displayVal=value==="__manual__"?"":value;
  return(
    <div style={{display:"flex",gap:0,flex:1,alignItems:"center"}}>
      <datalist id={listId}>
        {opts.map(s=><option key={s.id} value={s.name}>{s.licenseNo?"Lic: "+s.licenseNo:""}</option>)}
      </datalist>
      <input
        list={listId}
        value={displayVal}
        placeholder={placeholder}
        style={inp({flex:1,minWidth:width})}
        onChange={e=>onChange(e.target.value)}
      />
    </div>
  );
}

/* ─── Shared Styles ─── */
const C={
  bg:"#eef1f6", card:"#ffffff", border:"#e2e6ed",
  primary:"#0f2d4a", accent:"#0d7bbd", accentLight:"#e8f4fb",
  accentMid:"#b3d9f0",
  red:"#b91c1c", redLight:"#fef2f2", amber:"#d97706", amberLight:"#fffbeb",
  green:"#15803d", greenLight:"#f0fdf4",
  text:"#0f1e2d", muted:"#4f6070", faint:"#9db3c4",
  sidebarBg:"#0f2d4a", sidebarText:"#a8c0d0", sidebarActive:"#1a4a6b",
  surface:"#f7f9fc",
};
const inp=(extra={})=>({
  height:32,padding:"0 10px",border:`1.5px solid ${C.border}`,borderRadius:6,
  fontSize:12.5,color:C.text,background:"#fff",outline:"none",fontFamily:"inherit",
  transition:"border-color .15s, box-shadow .15s",...extra
});
const Btn=(variant="primary",extra={})=>{
  const base={height:32,padding:"0 16px",borderRadius:6,border:"none",cursor:"pointer",
    fontSize:12.5,fontWeight:600,fontFamily:"inherit",display:"inline-flex",alignItems:"center",
    gap:5,transition:"all .15s",letterSpacing:".01em",...extra};
  if(variant==="primary") return{...base,background:C.primary,color:"#fff",boxShadow:"0 1px 3px rgba(15,45,74,.25)"};
  if(variant==="accent")  return{...base,background:C.accent,color:"#fff",boxShadow:"0 1px 3px rgba(13,123,189,.3)"};
  if(variant==="ghost")   return{...base,background:"transparent",color:C.muted,border:`1.5px solid ${C.border}`};
  if(variant==="danger")  return{...base,background:"transparent",color:C.red,border:`1.5px solid #fca5a5`};
  if(variant==="success") return{...base,background:C.green,color:"#fff"};
  return base;
};
const Card=({children,style={}})=>(
  <div style={{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,
    boxShadow:"0 1px 4px rgba(15,45,74,.06)",...style}}>
    {children}
  </div>
);
const CardHead=({title,sub,right,icon})=>(
  <div style={{padding:"13px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",
    justifyContent:"space-between",alignItems:"center",background:C.surface}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      {icon&&<span style={{fontSize:18,lineHeight:1}}>{icon}</span>}
      <div>
        <div style={{fontWeight:700,fontSize:13.5,color:C.text,letterSpacing:"-.01em"}}>{title}</div>
        {sub&&<div style={{fontSize:11.5,color:C.muted,marginTop:2}}>{sub}</div>}
      </div>
    </div>
    {right&&<div>{right}</div>}
  </div>
);
const Label=({children})=>(
  <div style={{fontSize:10.5,fontWeight:700,color:C.faint,marginBottom:4,letterSpacing:".06em",textTransform:"uppercase"}}>{children}</div>
);
const Field=({label,children,style={}})=>(
  <div style={{display:"flex",flexDirection:"column",...style}}>
    <Label>{label}</Label>
    {children}
  </div>
);

/* ══════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════ */
export default function App(){
  const [licState,setLicState]=useState("checking"); // checking | valid | none | expired | revoked
  const [licData,setLicData]=useState(null);
  const [showKeyEntry,setShowKeyEntry]=useState(false);

  const SHEET_ID="18pzQW6JNoqXVnXXRmmFSWF3bw2RBC9LSJM2XFM4OZVo";

  // ── Re-check the sheet for this license (revoke/ban/expiry enforcement) ──
  const recheckSheet=async(lic)=>{
    if(!lic||!lic.keyHash)return "ok";
    try{
      const url=`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
      const res=await fetch(url,{signal:AbortSignal.timeout(6000)});
      const text=await res.text();
      const json=JSON.parse(text.slice(47,-2));
      const rows=json.table.rows;
      for(const row of rows){
        const rowHash     =row.c[0]?.v||"";
        const rowStatus   =(row.c[3]?.v||"").toLowerCase().trim();
        const rowExpiresAt=row.c[6]?.v||"";
        if(rowHash!==lic.keyHash)continue;
        // Check status
        if(["revoked","banned","disabled","expired"].includes(rowStatus))return rowStatus;
        // Check ExpiresAt date
        if(rowExpiresAt){
          const expDate=new Date(rowExpiresAt);
          if(!isNaN(expDate.getTime())&&Date.now()>expDate.getTime())return "expired";
        }
        return "ok";
      }
      return "ok"; // not found = allow (offline safety)
    }catch(e){
      return "ok"; // no internet = allow
    }
  };

  const WEBHOOK_URL="https://script.google.com/macros/s/AKfycbx9F4YkLm_NwKegCLDlvWNj8zjJpY29gfgNdsDqzqrT3h-gK03ilKFMWOAPH3Lx7ZpfVQ/exec";

  // ── Send DeviceID + ExpiresAt to sheet (no Content-Type header = no CORS preflight) ──
  const sendToSheet=async(keyHash,deviceId,expiresAt)=>{
    try{
      // Use URLSearchParams so no preflight is triggered
      const body=new URLSearchParams({keyHash,deviceId,expiresAt});
      await fetch(WEBHOOK_URL,{
        method:"POST",
        body,
      });
    }catch(e){/* silent fail */}
  };

  useEffect(()=>{
    const check=async()=>{
      const lic=loadLicense();
      if(!lic){setLicState("none");return;}

      // Verify signature — prevents localStorage tampering
      const valid=await verifyLicenseSig(lic);
      if(!valid){
        localStorage.removeItem(SK_STORE);
        setLicState("none");
        return;
      }

      // Check local expiry first
      const localStatus=licenseStatus(lic);
      if(localStatus==="expired"){
        // ── Add to blacklist so they can't reuse this key offline ──
        if(lic.keyHash&&lic.type!=="lifetime"){
          const bl=JSON.parse(localStorage.getItem("medlims_blacklist")||"{}");
          bl[lic.keyHash]={expiredAt:Date.now(),type:lic.type};
          localStorage.setItem("medlims_blacklist",JSON.stringify(bl));
        }
        setLicData(lic);setLicState("expired");return;
      }

      // ── Re-check Google Sheet on every startup ──
      const sheetStatus=await recheckSheet(lic);
      if(sheetStatus==="revoked"||sheetStatus==="banned"||sheetStatus==="disabled"){
        localStorage.removeItem(SK_STORE);
        localStorage.removeItem("medlims_used_keys");
        setLicState("none");
        return;
      }
      if(sheetStatus==="expired"){
        // Add to blacklist so offline reuse is also blocked
        if(lic.keyHash&&lic.type!=="lifetime"){
          const bl=JSON.parse(localStorage.getItem("medlims_blacklist")||"{}");
          bl[lic.keyHash]={expiredAt:Date.now(),type:lic.type};
          localStorage.setItem("medlims_blacklist",JSON.stringify(bl));
        }
        setLicData(lic);setLicState("expired");return;
      }

      setLicData(lic);
      setLicState("valid");

      // ── If DeviceID was never written (offline activation), write it now ──
      if(lic.keyHash&&lic.deviceId){
        try{
          const SHEET_ID="18pzQW6JNoqXVnXXRmmFSWF3bw2RBC9LSJM2XFM4OZVo";
          const url=`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
          const res=await fetch(url,{signal:AbortSignal.timeout(4000)});
          const text=await res.text();
          const json=JSON.parse(text.slice(47,-2));
          const rows=json?.table?.rows||[];
          for(const row of rows){
            if((row.c[0]?.v||"").trim()===lic.keyHash){
              const rowDevice=(row.c[4]?.v||"").trim();
              // If DeviceID is blank in sheet — write it now
              if(!rowDevice){
                const expiresAtStr=lic.expiresAt
                  ?new Date(lic.expiresAt).toISOString().slice(0,10):"";
                sendToSheet(lic.keyHash,lic.deviceId,expiresAtStr);
              }
              break;
            }
          }
        }catch(e){/* offline — skip */}
      }
    };
    check();
  },[]);

  // ── Periodic re-check every 30 minutes while app is open ──
  useEffect(()=>{
    if(licState!=="valid"||!licData)return;
    const interval=setInterval(async()=>{
      const sheetStatus=await recheckSheet(licData);
      if(sheetStatus==="revoked"||sheetStatus==="banned"||sheetStatus==="disabled"){
        localStorage.removeItem(SK_STORE);
        localStorage.removeItem("medlims_used_keys");
        setLicState("none");
      }
      if(sheetStatus==="expired"){
        // Blacklist so they can't reactivate offline
        if(licData.keyHash&&licData.type!=="lifetime"){
          const bl=JSON.parse(localStorage.getItem("medlims_blacklist")||"{}");
          bl[licData.keyHash]={expiredAt:Date.now(),type:licData.type};
          localStorage.setItem("medlims_blacklist",JSON.stringify(bl));
        }
        setLicState("expired");
      }
    },30*60*1000);
    return()=>clearInterval(interval);
  },[licState,licData]);

  const handleActivated=()=>{
    const lic=loadLicense();
    setLicData(lic);
    setLicState("valid");
    setShowKeyEntry(false);
    // Fire-and-forget writeback after UI transitions
    if(lic&&lic.keyHash){
      const expiresAtStr=lic.expiresAt
        ?new Date(lic.expiresAt).toISOString().slice(0,10):"";
      setTimeout(()=>sendToSheet(lic.keyHash,lic.deviceId,expiresAtStr),800);
    }
  };

  if(licState==="checking")return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      background:"#0f2027",color:"#fff",fontSize:14}}>Checking license...</div>
  );
  if(licState==="none"||showKeyEntry)return <SerialKeyGate onActivated={handleActivated}/>;
  if(licState==="expired")return <LicenseExpiredGate licType={licData?.type} onReactivate={()=>setShowKeyEntry(true)}/>;

  return <AppMain licData={licData}/>;
}

function AppMain({licData}){
  const [view,setView]=useState("dashboard");
  const [barcodeNav,setBarcodeNav]=useState(null); // {patientId, testIds} from barcode scan
  const [patients,setPatients]=useState([]);
  const [staff,setStaff]=useState([]);
  const [results,setResults]=useState([]);
  const [tests,setTests]=useState(null);
  const [hospital,setHospital]=useState({name:"",address:"",phone:"",setupDone:false});
  const [accounts,setAccounts]=useState([]);
  const [currentUser,setCurrentUser]=useState(null);
  const [switchModal,setSwitchModal]=useState(false);
  const [time,setTime]=useState(new Date());
  const [loaded,setLoaded]=useState(false);
  const [printQ,setPrintQ]=useState([]);  // queue of results to print
  const [batchTotal,setBatchTotal]=useState(0);  // total items in current batch
  const [crossSectionPatientId,setCrossSectionPatientId]=useState("");  // pre-fill patient when switching sections
  const [batchDone,setBatchDone]=useState(0);     // how many completed
  const [batchActive,setBatchActive]=useState(false); // is batch printing active
  const [batchCurrentName,setBatchCurrentName]=useState(""); // current patient name

  useEffect(()=>{
    setPatients(dbLoadChunked("lims_p3",[]));
    setStaff(dbLoad("lims_s3",[]));
    setResults(dbLoadChunked("lims_r3",[]));
    // Load saved tests, then merge any new sections from DEFAULT_TESTS
    // This ensures new sections (coagulation, othertests etc.) appear on existing installs
    const savedTests=dbLoad("lims_t3",null);
    if(savedTests){
      const merged={...savedTests};
      Object.keys(DEFAULT_TESTS).forEach(k=>{
        if(!merged[k]||merged[k].length===0) merged[k]=JSON.parse(JSON.stringify(DEFAULT_TESTS[k]));
      });
      setTests(merged);
    } else {
      setTests(DEFAULT_TESTS);
    }
    const hi=dbLoad("lims_h3",null);
    if(hi)setHospital(hi);
    // Load accounts — seed default admin if none exist
    const accs=dbLoad("lims_accounts",[]);
    if(accs.length===0){
      const defaultAccounts=[{id:uid(),username:"admin",password:"admin123",role:"Admin",name:"Administrator",createdAt:toInputDate()}];
      setAccounts(defaultAccounts);
      dbSave("lims_accounts",defaultAccounts);
    } else {
      setAccounts(accs);
    }
    setLoaded(true);
    const t=setInterval(()=>setTime(new Date()),1000);
    return()=>clearInterval(t);
  },[]);

  const sp=v=>{setPatients(v);dbSaveChunked("lims_p3",v);};
  const ss=v=>{setStaff(v);dbSave("lims_s3",v);};
  const sr=v=>{setResults(v);dbSaveChunked("lims_r3",v);};
  const st=v=>{setTests(v);dbSave("lims_t3",v);};
  const sh=v=>{setHospital(v);dbSave("lims_h3",v);};
  const sa=v=>{setAccounts(v);dbSave("lims_accounts",v);};

  const addResult=r=>{const u=[r,...results];sr(u);};
  // Clear crossSectionPatientId once the new section has mounted
  useEffect(()=>{ if(crossSectionPatientId) setCrossSectionPatientId(""); },[curSection]);
  const delResult=id=>sr(results.filter(r=>r.id!==id));
  const editResult=r=>sr(results.map(x=>x.id===r.id?r:x));

  // Process print queue sequentially with progress tracking
  useEffect(()=>{
    if(!printQ||printQ.length===0){
      if(batchActive){
        // Batch just finished
        setTimeout(()=>{setBatchActive(false);setBatchTotal(0);setBatchDone(0);setBatchCurrentName("");},1200);
      }
      return;
    }
    const isBatch = !!printQ._batch;
    // Initialize batch tracking on first item
    if(isBatch && !batchActive){
      setBatchTotal(printQ.length);
      setBatchDone(0);
      setBatchActive(true);
    }
    const [next,...rest]=printQ;
    const pt=patients.find(p=>p.id===next.patientId);
    if(isBatch) setBatchCurrentName(pt?.name||"Patient");
    downloadResultAsPDF(next,pt,hospital,isBatch,staff)
      .then(()=>{
        // Mark this result as printed — use functional update to avoid stale closure in batch
        setResults(prev=>{
          const updated=prev.map(r=>r.id===next.id?{...r,printed:true,printedAt:new Date().toISOString()}:r);
          dbSave("lims_r3",updated);
          return updated;
        });
        if(isBatch) setBatchDone(prev=>prev+1);
        if(rest.length>0){
          setTimeout(()=>{
            const nextQ=[...rest];
            if(isBatch) nextQ._batch=true;
            setPrintQ(nextQ);
          },600);
        } else setPrintQ([]);
      })
      .catch(e=>{ console.error(e); if(isBatch)setBatchDone(prev=>prev+1); setPrintQ(rest); });
  },[printQ]);

  if(!loaded||!tests)return(
    <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      background:C.bg,fontFamily:"'Segoe UI',sans-serif",fontSize:14,color:C.muted,
      flexDirection:"column",gap:12}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{width:36,height:36,borderRadius:"50%",border:`3px solid ${C.accentMid}`,
        borderTopColor:C.accent,animation:"spin .8s linear infinite"}}/>
      <div style={{fontSize:13,color:C.faint,letterSpacing:".04em"}}>Loading MedLIMS…</div>
    </div>
  );

  // Show setup/welcome page on first launch
  if(!hospital.setupDone)return(
    <WelcomePage hospital={hospital} onSave={h=>{const v={...h,setupDone:true};sh(v);}}/>
  );

  // Show login page if not authenticated
  if(!currentUser)return(
    <LoginPage accounts={accounts} onLogin={setCurrentUser} hospital={hospital}/>
  );

  const curSection=view.startsWith("lab:")?view.slice(4):null;
  const secDef=curSection?SECTIONS.find(s=>s.id===curSection):null;
  const today=results.filter(r=>r.date===toInputDate()).length;
  const flagged=results.filter(r=>r.lines?.some(l=>l.flag&&l.flag!=="")).length;

  const isAdmin=currentUser?.role==="Admin";
  const navItems=[
    {id:"dashboard",   icon:"⊞",  label:"Dashboard"},
    {id:"patients",    icon:"👤",  label:"Patients"},
    {id:"personnel",   icon:"👨‍⚕️",label:"Personnel"},
    {id:"parameters",  icon:"⚙",  label:"Parameters"},
    {id:"templates",   icon:"🎨", label:"Templates"},
    {id:"reports",     icon:"📊", label:"Reports"},
    {id:"summary",     icon:"📋", label:"Summary"},
    {id:"barcode",     icon:"▦",  label:"Barcode"},
    {id:"hospitalinfo",icon:"🏥", label:"Hospital Info"},
    ...(isAdmin?[{id:"accounts",icon:"🔐",label:"User Accounts"}]:[]),
  ];

  return(
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",fontSize:13,background:C.bg,
      minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <style>{`
        *{box-sizing:border-box;}
        input,select,textarea{-webkit-user-select:text!important;user-select:text!important;}
        input:focus,select:focus,textarea:focus{border-color:${C.accent}!important;box-shadow:0 0 0 3px ${C.accentLight}!important;outline:none!important;}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#eef1f6}
        ::-webkit-scrollbar-thumb{background:#b3c5d4;border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:#8fa8ba}
        input[type=checkbox]{width:15px;height:15px;cursor:pointer;accent-color:${C.accent}}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}
        button:hover{opacity:.88}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}
        .shake{animation:shake .38s ease}
        .fade-up{animation:fadeUp .45s cubic-bezier(.2,.8,.3,1) forwards}
      `}</style>

      {/* ─── Top Header ─── */}
      <div style={{background:C.primary,color:"#fff",padding:"0 24px",height:54,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        boxShadow:"0 2px 12px rgba(0,0,0,.2)",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:13}}>
          <div style={{width:36,height:36,borderRadius:9,background:"rgba(255,255,255,.12)",
            border:"1px solid rgba(255,255,255,.18)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏥</div>
          <div>
            <div style={{fontWeight:700,fontSize:14.5,letterSpacing:"-.01em"}}>{hospital.name}</div>
            <div style={{fontSize:9.5,opacity:.5,letterSpacing:".1em",textTransform:"uppercase",marginTop:1}}>Laboratory Information Management System</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:18}}>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:17,fontWeight:300,fontVariantNumeric:"tabular-nums",letterSpacing:".04em",opacity:.9}}>
              {time.toLocaleTimeString("en-US",{hour12:false})}
            </div>
            <div style={{fontSize:10,opacity:.5,marginTop:1}}>{time.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}</div>
          </div>
          <div style={{width:1,height:32,background:"rgba(255,255,255,.12)"}}/>
          <div style={{display:"flex",alignItems:"center",gap:9,
            background:"rgba(255,255,255,.08)",borderRadius:22,padding:"5px 13px 5px 7px",
            border:"1px solid rgba(255,255,255,.1)"}}>
            <div style={{width:30,height:30,borderRadius:"50%",
              background:"rgba(255,255,255,.2)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>👤</div>
            <div>
              <div style={{fontSize:12.5,fontWeight:600,letterSpacing:"-.01em"}}>{currentUser.name}</div>
              <div style={{fontSize:10,opacity:.55,marginTop:.5}}>{currentUser.role}</div>
            </div>
            <div style={{display:"flex",gap:5,marginLeft:4}}>
            <button onClick={()=>setSwitchModal(true)}
              style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",
                color:"rgba(255,255,255,.85)",borderRadius:5,padding:"3px 9px",fontSize:11,
                cursor:"pointer",fontFamily:"inherit",fontWeight:500}}>
              ⇄ Switch
            </button>
            <button onClick={()=>setCurrentUser(null)}
              style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",
                color:"rgba(255,255,255,.85)",borderRadius:5,padding:"3px 9px",fontSize:11,
                cursor:"pointer",fontFamily:"inherit",fontWeight:500}}>
              Log Out
            </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{display:"flex",flex:1,minHeight:0}}>

        {/* ─── Sidebar ─── */}
        <div style={{width:190,background:C.sidebarBg,display:"flex",flexDirection:"column",
          flexShrink:0,overflowY:"auto"}}>
          <div style={{padding:"18px 14px 8px",fontSize:9.5,fontWeight:700,color:"rgba(255,255,255,.3)",
            letterSpacing:".12em",textTransform:"uppercase"}}>Navigation</div>
          {navItems.map(n=>{
            const active=view===n.id||(n.id==="dashboard"&&!!curSection);
            return(
            <button key={n.id} onClick={()=>setView(n.id)}
              style={{width:"100%",
                background:active?"rgba(255,255,255,.1)":"transparent",
                border:"none",
                color:active?"#fff":C.sidebarText,
                padding:"9px 14px",cursor:"pointer",fontSize:12.5,fontFamily:"inherit",
                display:"flex",alignItems:"center",gap:10,textAlign:"left",
                borderLeft:active?`3px solid ${C.accent}`:"3px solid transparent",
                transition:"all .15s"}}>
              <span style={{fontSize:15,opacity:active?1:.75}}>{n.icon}</span>
              <span style={{fontWeight:active?600:400,letterSpacing:"-.01em"}}>{n.label}</span>
            </button>
            );
          })}

          <div style={{flex:1}}/>
          <button onClick={()=>setView("reports")}
            style={{margin:"0 10px 8px",background:results.length>0?"rgba(13,123,189,.18)":"rgba(255,255,255,.06)",
              border:`1px solid ${results.length>0?"rgba(13,123,189,.4)":"rgba(255,255,255,.1)"}`,
              borderRadius:7,padding:"8px 12px",cursor:"pointer",fontFamily:"inherit",
              display:"flex",alignItems:"center",gap:8,transition:"all .15s",color:"#fff"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(13,123,189,.28)"}
            onMouseLeave={e=>e.currentTarget.style.background=results.length>0?"rgba(13,123,189,.18)":"rgba(255,255,255,.06)"}>
            <span style={{fontSize:14}}>📊</span>
            <div style={{flex:1,textAlign:"left"}}>
              <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,.9)"}}>Reports</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.45)",marginTop:1}}>{results.length} result{results.length!==1?"s":""}</div>
            </div>
            <span style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>→</span>
          </button>
          <div style={{padding:"14px 16px",borderTop:"1px solid rgba(255,255,255,.08)",background:"rgba(0,0,0,.1)"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,.35)",marginBottom:3,letterSpacing:".04em"}}>Logged in as</div>
            <div style={{fontSize:12.5,color:"#fff",fontWeight:600,letterSpacing:"-.01em"}}>{currentUser.username}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.3)",marginTop:2}}>MedLIMS v1.0</div>
          </div>
        </div>

        {/* ─── Main Content ─── */}
        <div style={{flex:1,overflowY:"auto",padding:20,display:"flex",flexDirection:"column",gap:16}}>

          {/* DASHBOARD */}
          {view==="dashboard"&&(
            <DashboardView results={results} patients={patients} sections={SECTIONS}
              onNav={setView} onPrint={r=>setPrintQ(q=>[...q,r])} patients_list={patients}/>
          )}

          {/* LAB ENTRY */}
          {curSection&&(
            <LabEntry key={curSection+(barcodeNav?.patientId||"")} section={curSection} secDef={secDef}
              tests={tests} patients={patients} staff={staff} results={results}
              hospital={hospital} onSave={addResult} onPrint={r=>setPrintQ(q=>[...q,r])}
              onSwitchSection={(v,patId)=>{if(patId)setCrossSectionPatientId(patId);else setCrossSectionPatientId("");setView(v);}}
              preSelectedTests={barcodeNav?.section===curSection?barcodeNav.testIds:null}
              prePatientId={barcodeNav?.section===curSection?barcodeNav.patientId:(crossSectionPatientId||"")}/>
          )}

          {/* REPORTS */}
          {view==="reports"&&(
            <ReportsView results={results} patients={patients} staff={staff} onPrint={r=>setPrintQ(q=>[...q,r])} onBatchPrint={batchQ=>{const q=[...batchQ];q._batch=true;setPrintQ(q);}} onDelete={delResult} onEdit={editResult}/>
          )}

          {/* PATIENTS */}
          {view==="patients"&&(
            <PatientsView data={patients} onSave={sp}/>
          )}

          {/* PERSONNEL */}
          {view==="personnel"&&(
            <PersonnelView data={staff} onSave={ss}/>
          )}

          {/* PARAMETERS */}
          {view==="parameters"&&(
            <ParametersView tests={tests} onSave={st}/>
          )}

          {/* TEMPLATES */}
          {view==="templates"&&(
            <TemplatesView sections={SECTIONS} hospital={hospital}/>
          )}

          {/* SUMMARY */}
          {view==="summary"&&(
            <SummaryView results={results} patients={patients} hospital={hospital}/>
          )}

          {/* HOSPITAL INFO */}
          {view==="hospitalinfo"&&(
            <HospitalView data={hospital} onSave={sh}/>
          )}

          {/* ACCOUNTS — admin only */}
          {view==="accounts"&&(
            <AccountsView accounts={accounts} onSave={sa} currentUser={currentUser}/>
          )}

          {/* BARCODE */}
          {view==="barcode"&&(
            <BarcodeView patients={patients} tests={tests} sections={SECTIONS} onNav={(v,bNav)=>{if(bNav)setBarcodeNav(bNav);setView(v);}}/>
          )}
        </div>
      </div>
      {switchModal&&(
        <SwitchProfileModal accounts={accounts} currentUser={currentUser}
          onSwitch={u=>{setCurrentUser(u);setSwitchModal(false);}}
          onClose={()=>setSwitchModal(false)}/>
      )}
      {/* ── Batch Print Progress Overlay ── */}
      {batchActive&&(
        <div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(15,45,74,.85)",
          display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
          <div style={{background:"#fff",borderRadius:16,padding:"40px 50px",textAlign:"center",
            boxShadow:"0 20px 60px rgba(0,0,0,.4)",minWidth:360,maxWidth:440}}>
            {/* Icon */}
            <div style={{width:72,height:72,borderRadius:"50%",margin:"0 auto 20px",
              background:batchDone>=batchTotal?"#dcfce7":"#e8f4fb",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,
              border:batchDone>=batchTotal?"3px solid #86efac":`3px solid ${C.accentMid}`}}>
              {batchDone>=batchTotal?"✅":"🖨"}
            </div>
            {/* Title */}
            <div style={{fontWeight:700,fontSize:18,color:C.primary,marginBottom:6}}>
              {batchDone>=batchTotal?"Batch Print Complete!":"Printing Results…"}
            </div>
            {/* Counter */}
            <div style={{fontSize:36,fontWeight:800,color:batchDone>=batchTotal?C.green:C.accent,
              letterSpacing:"-0.02em",margin:"10px 0"}}>
              {batchDone} / {batchTotal}
            </div>
            {/* Progress bar */}
            <div style={{background:"#e2e8f0",borderRadius:6,height:8,overflow:"hidden",marginBottom:14}}>
              <div style={{height:"100%",borderRadius:6,transition:"width .4s ease",
                background:batchDone>=batchTotal?"#22c55e":`linear-gradient(90deg,${C.accent},${C.accentMid})`,
                width:`${batchTotal>0?Math.round((batchDone/batchTotal)*100):0}%`}}/>
            </div>
            {/* Current item */}
            {batchDone<batchTotal&&batchCurrentName&&(
              <div style={{fontSize:12,color:C.muted,marginBottom:4}}>
                Now printing: <strong style={{color:C.text}}>{batchCurrentName}</strong>
              </div>
            )}
            <div style={{fontSize:11,color:C.faint}}>
              {batchDone>=batchTotal
                ?"All results have been sent to the printer."
                :"Please wait — do not close the application."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════ */
function DashboardView({results,patients,sections,onNav,onPrint}){
  const today=toInputDate();
  const todayResults=results.filter(r=>r.date===today);
  const flagged=results.filter(r=>r.lines?.some(l=>l.flag));
  const getP=id=>patients.find(p=>p.id===id);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[
          {label:"Total Patients",value:patients.length,icon:"👤",color:"#1e5fa8",bg:"#dbeafe",border:"#bfdbfe"},
          {label:"Today's Results",value:todayResults.length,icon:"📋",color:"#166534",bg:"#dcfce7",border:"#bbf7d0"},
          {label:"Total Results",value:results.length,icon:"🗂",color:"#5b21b6",bg:"#ede9fe",border:"#ddd6fe"},
          {label:"Flagged Results",value:flagged.length,icon:"⚠",color:"#9f1239",bg:"#ffe4e6",border:"#fecdd3"},
        ].map(k=>(
          <Card key={k.label} style={{border:`1px solid ${k.border}`}}>
            <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:46,height:46,borderRadius:11,background:k.bg,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{k.icon}</div>
              <div>
                <div style={{fontSize:26,fontWeight:700,color:k.color,lineHeight:1,letterSpacing:"-.02em"}}>{k.value}</div>
                <div style={{fontSize:11.5,color:C.muted,marginTop:4,fontWeight:500}}>{k.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Section Quick Access */}
      <Card>
        <CardHead title="Laboratory Sections" sub="Click to enter results" icon="🔬"/>
        <div style={{padding:16,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {sections.map(s=>{
            const count=results.filter(r=>r.section===s.id&&r.date===today).length;
            return(
              <button key={s.id} onClick={()=>onNav(`lab:${s.id}`)}
                style={{background:"#fff",border:`1.5px solid ${s.color}30`,borderRadius:9,
                  padding:"14px 16px",cursor:"pointer",textAlign:"left",transition:"all .18s",
                  fontFamily:"inherit",boxShadow:"0 1px 3px rgba(0,0,0,.05)"}}
                onMouseEnter={e=>{e.currentTarget.style.background=s.color+"0e";e.currentTarget.style.borderColor=s.color+"60";e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,.1)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.borderColor=s.color+"30";e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,.05)";}}>
                <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div>
                <div style={{fontWeight:700,fontSize:12.5,color:s.color,letterSpacing:"-.01em"}}>{s.label}</div>
                <div style={{fontSize:11,color:C.faint,marginTop:3,fontWeight:500}}>{count} result{count!==1?"s":""}</div>
              </button>
            );
          })}
        </div>
      </Card>

    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LAB ENTRY
══════════════════════════════════════════════════════ */
function LabEntry({section,secDef,tests,patients,staff,results,hospital,onSave,onPrint,onSwitchSection=null,preSelectedTests=null,prePatientId=""}){
  const groups=tests[section]||[];
  const allTests=groups.flatMap(g=>g.tests);

  const nowDT=()=>{
    const n=new Date();
    return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0")+"T"+String(n.getHours()).padStart(2,"0")+":"+String(n.getMinutes()).padStart(2,"0");
  };

  const [form,setForm]=useState(()=>{
    const initialTicked={};
    if(preSelectedTests&&preSelectedTests.length>0){
      preSelectedTests.forEach(id=>{initialTicked[id]=true;});
    }
    return {
      patientId:prePatientId||"",physician:"",pathologist:"",medtech:"",validatedBy:"",
      datetime:nowDT(),ward:"",values:{},ticked:initialTicked,brands:{},countValues:{},remark:"",
    };
  });
  // Track which dropdown fields are switched to manual typing
  const [manualMode,setManualMode]=useState({});
  const [saved,setSaved]=useState(null);
  const [showConfirm,setShowConfirm]=useState(false);

  const pat=patients.find(p=>p.id===form.patientId);

  // If preSelectedTests is set, only allow toggling those tests; others are locked hidden
  const barcodeMode=preSelectedTests&&preSelectedTests.length>0;
  const preSet=barcodeMode?new Set(preSelectedTests):null;

  const toggleTick=id=>{
    if(barcodeMode&&!preSet.has(id))return; // locked in barcode mode
    setForm(p=>({...p,ticked:{...p.ticked,[id]:!p.ticked[id]}}));
  };
  const tickAll=()=>{const t={};allTests.forEach(t2=>{t[t2.id]=true;});setForm(p=>({...p,ticked:t}));};
  const untickAll=()=>setForm(p=>({...p,ticked:{}}));
  const toggleManual=id=>setManualMode(p=>({...p,[id]:!p[id]}));

  // For fecalysis and urinalysis: all tests are always selected — no tick needed
  const isAutoTickSection=section==="fecalysis"||section==="urinalysis";
  // Helper: is a test considered "ticked"?
  const isTicked=(id)=>isAutoTickSection||!!form.ticked[id];

  // ── Auto-set parasitology defaults when entering fecalysis
  useEffect(()=>{
    if(section!=="fecalysis")return;
    const parasiteIds=["fascaris","ftrich","fhook"];
    const amoebaId="famoeba";
    setForm(p=>{
      const newVals={...p.values};const newTicked={...p.ticked};
      let changed=false;
      parasiteIds.forEach(id=>{
        if(!newTicked[id]){newTicked[id]=true;changed=true;}
        if(!newVals[id]){newVals[id]="NO OVA OF PARASITE SEEN";changed=true;}
      });
      if(!newTicked[amoebaId]){newTicked[amoebaId]=true;changed=true;}
      if(!newVals[amoebaId]){newVals[amoebaId]="NONE SEEN";changed=true;}
      return changed?{...p,ticked:newTicked,values:newVals}:p;
    });
  },[section]);

  const getFlag=(t,val)=>{
    const n=parseFloat(val);
    if(isNaN(n))return"";
    const mn=parseFloat(t.normalMin);
    const mx=parseFloat(t.normalMax);
    if(t.normalMin!==undefined&&t.normalMin!==""&&!isNaN(mn)&&n<mn)return"LO";
    if(t.normalMax!==undefined&&t.normalMax!==""&&!isNaN(mx)&&n>mx)return"HI";
    return"";
  };

  // ── All Negative fix: works for ANY group/test that has "Negative" as normalText or dropdown option
  const setAllNegative=(grp)=>{
    const t={};const v={};
    grp.tests.forEach(t2=>{
      t[t2.id]=true;
      // Use "Negative" if: normalText is Negative, or dropdown has Negative option, or no options
      const hasNegOpt=t2.options?.some(o=>o.toLowerCase()==="negative");
      const normalIsNeg=(t2.normalText||"").toLowerCase()==="negative";
      if(normalIsNeg||hasNegOpt||(!t2.options?.length)){
        v[t2.id]="Negative";
      }
    });
    setForm(p=>({...p,ticked:{...p.ticked,...t},values:{...p.values,...v}}));
  };

  // Check if a group has any "Negative" default tests (for showing All Negative button)
  const groupHasNegative=(grp)=>grp.tests.some(t=>
    (t.normalText||"").toLowerCase()==="negative"||
    t.options?.some(o=>o.toLowerCase()==="negative")
  );

  const handleSave=()=>{
    if(!form.patientId)return alert("Please select a patient.");
    // For auto-tick sections, all tests are included; otherwise use ticked
    const ticked=isAutoTickSection
      ? allTests.map(t=>t.id)
      : Object.keys(form.ticked).filter(id=>form.ticked[id]);
    if(!ticked.length)return alert("Please tick at least one test.");
    const lines=ticked.map(id=>{
      const t=allTests.find(x=>x.id===id);
      // Find which group this test belongs to
      const grp=groups.find(g=>g.tests.some(gt=>gt.id===id));
      let val=form.values[id]||"";
      // Fecalysis parasitology defaults — ensure they're never blank
      if(section==="fecalysis"&&!val){
        if(["fascaris","ftrich","fhook"].includes(id)) val="NO OVA OF PARASITE SEEN";
        if(id==="famoeba") val="NONE SEEN";
      }
      // Combine count number with dropdown for casts: "3 - Coarse Granular"
      if(t?.showCount&&form.countValues?.[id]){
        const cnt=(form.countValues[id]||"").trim();
        if(cnt) val=val?`${cnt} - ${val}`:cnt;
      }
      return{testId:id,testName:t?.name||id,value:val,unit:t?.unit||"",
        normalRange:t?.normalText||"",flag:val?getFlag(t,val):"",
        brand:form.brands[id]||"",showBrand:t?.showBrand||false,
        showUnit:t?.showUnit!==false,showNormal:t?.showNormal!==false,showFlag:t?.showFlag!==false,
        groupName:grp?.group||""};
    });
    const dtVal=form.datetime||"";
    const dtDate=dtVal?dtVal.slice(0,10):"";
    const dtRaw=dtVal?dtVal.slice(11,16):"";
    const fmt12=(t24)=>{if(!t24)return"";const[h,m]=t24.split(":");let hh=parseInt(h,10);const ap=hh>=12?"PM":"AM";hh=hh%12||12;return`${hh}:${m} ${ap}`;};
    const rec={
      id:uid(),
      resultNo:"RES-"+String(results.length+1).padStart(5,"0"),
      section,sectionLabel:secDef?.label,
      patientId:form.patientId,
      physician:form.physician||"",
      pathologist:form.pathologist||"",
      pathologistLic:(staff.find(s=>s.name===form.pathologist)?.licenseNo||""),
      medtech:form.medtech||"",
      medtechLic:(staff.find(s=>s.name===form.medtech)?.licenseNo||""),
      validatedBy:form.validatedBy||"",
      validatedByLic:(staff.find(s=>s.name===form.validatedBy)?.licenseNo||""),
      date:dtDate,time:fmt12(dtRaw),ward:form.ward,remark:form.remark||"",
      lines,savedAt:new Date().toISOString(),
    };
    onSave(rec);setSaved(rec);setShowConfirm(true);
  };

  const clear=()=>{
    const newForm={patientId:"",physician:"",pathologist:"",medtech:"",validatedBy:"",datetime:nowDT(),ward:"",values:{},ticked:{},brands:{},countValues:{},remark:""};
    // Re-apply fecalysis defaults
    if(section==="fecalysis"){
      ["fascaris","ftrich","fhook"].forEach(id=>{newForm.ticked[id]=true;newForm.values[id]="NO OVA OF PARASITE SEEN";});
      newForm.ticked["famoeba"]=true;newForm.values["famoeba"]="NONE SEEN";
    }
    setForm(newForm);setManualMode({});
  };

  // ── Success overlay (shown after save, non-destructive)
  if(showConfirm&&saved){
    const pt=patients.find(p=>p.id===saved?.patientId)||{name:"Patient"};
    return(
      <div style={{display:"flex",flexDirection:"column",gap:16,maxWidth:560}}>
        <Card>
          <div style={{padding:32,textAlign:"center"}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:"#dcfce7",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,
              margin:"0 auto 16px",border:"3px solid #86efac"}}>✅</div>
            <div style={{fontWeight:700,fontSize:17,color:C.text,marginBottom:6}}>
              Result Saved Successfully
            </div>
            <div style={{color:C.muted,fontSize:13,marginBottom:4}}>
              <strong>{saved.resultNo}</strong> · {pt.name}
            </div>
            <div style={{color:C.muted,fontSize:12,marginBottom:24}}>
              {secDef?.label} · {fmtDate(saved.date)}
            </div>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <button style={{...Btn("primary"),minWidth:180,justifyContent:"center"}}
                onClick={()=>{ try{onPrint(saved);}catch(e){console.error(e);} }}>
                🖨 Print PDF Report
              </button>
              <button style={{...Btn("ghost"),minWidth:140,justifyContent:"center"}}
                onClick={()=>{clear();setSaved(null);setShowConfirm(false);}}>
                ➕ New Entry
              </button>
            </div>
            {/* Add another test for same patient in different section */}
            {onSwitchSection&&(
              <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${C.border}`}}>
                <div style={{fontSize:12,color:C.muted,marginBottom:8,fontWeight:600}}>
                  Add another test for <strong>{patients.find(p=>p.id===saved.patientId)?.name||"this patient"}</strong>:
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
                  {SECTIONS.filter(s=>s.id!==section).map(s=>(
                    <button key={s.id}
                      style={{...Btn("ghost",{fontSize:11,height:28,padding:"0 10px"}),
                        borderColor:s.color,color:s.color,background:s.color+"12"}}
                      onClick={()=>{
                        const patId=saved?.patientId||"";
                        setSaved(null);setShowConfirm(false);
                        if(onSwitchSection) onSwitchSection("lab:"+s.id, patId);
                      }}>
                      {s.icon} {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
        <div style={{textAlign:"center",fontSize:11,color:C.muted}}>
          Result saved to local storage. You can view it in Reports &amp; History.
        </div>
      </div>
    );
  }

  const tickedCount=isAutoTickSection?allTests.length:Object.values(form.ticked).filter(Boolean).length;

  // ── Render one test row (used in 2-col grid)
  // ── Special fecalysis parasitology renderer
  const renderParasitology=(grp)=>{
    const parasiteTests=["fascaris","ftrich","fhook"]; // No ova tests
    const amoeba=grp.tests.find(t=>t.id==="famoeba");
    const flagellates=grp.tests.find(t=>t.id==="fflagel");
    const others=grp.tests.find(t=>t.id==="fothers");
    const noOvaTests=grp.tests.filter(t=>parasiteTests.includes(t.id));

    return(
      <div>
        {/* No Ova tests */}
        {noOvaTests.map(t=>{
          const val=form.values[t.id]||"NO OVA OF PARASITE SEEN";
          const isSeen=val!=="NO OVA OF PARASITE SEEN";
          return(
            <div key={t.id} style={{padding:"8px 10px",borderBottom:`1px solid ${C.border}`,
              background:"#fff"}}>
              <div style={{fontWeight:600,fontSize:12,color:C.text,marginBottom:5}}>{t.name}</div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {/* No Ova radio */}
                <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",fontSize:12}}>
                  <input type="radio" name={`para_${t.id}`}
                    checked={!isSeen}
                    onChange={()=>setForm(p=>({...p,
                      ticked:{...p.ticked,[t.id]:true},
                      values:{...p.values,[t.id]:"NO OVA OF PARASITE SEEN"}}))}
                    style={{accentColor:C.accent,cursor:"pointer"}}/>
                  <span style={{color:!isSeen?C.primary:"#555",fontWeight:!isSeen?700:400}}>
                    NO OVA OF PARASITE SEEN
                  </span>
                </label>
                {/* Seen radio + text */}
                <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",fontSize:12}}>
                  <input type="radio" name={`para_${t.id}`}
                    checked={isSeen}
                    onChange={()=>setForm(p=>({...p,
                      ticked:{...p.ticked,[t.id]:true},
                      values:{...p.values,[t.id]:"Seen: "}}))}
                    style={{accentColor:C.accent,cursor:"pointer"}}/>
                  <span style={{color:isSeen?C.primary:"#555",fontWeight:isSeen?700:400}}>Seen</span>
                  {isSeen&&(
                    <input value={val.startsWith("Seen: ")?val.slice(6):val}
                      onChange={e=>setForm(p=>({...p,
                        values:{...p.values,[t.id]:"Seen: "+e.target.value}}))}
                      style={inp({width:90,fontSize:11,height:24,padding:"0 6px"})}
                      placeholder="count…"/>
                  )}
                  <span style={{fontSize:10,color:C.muted}}>/Coverslip</span>
                </label>
              </div>
            </div>
          );
        })}

        {/* Amoeba */}
        {amoeba&&(()=>{
          const val=form.values[amoeba.id]||"NONE SEEN";
          return(
            <div style={{padding:"8px 10px",borderBottom:`1px solid ${C.border}`,background:"#fff"}}>
              <div style={{fontWeight:600,fontSize:12,color:C.text,marginBottom:5}}>Amoeba</div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",fontSize:12}}>
                  <input type="radio" name="para_amoeba" checked={val==="NONE SEEN"}
                    onChange={()=>setForm(p=>({...p,
                      ticked:{...p.ticked,[amoeba.id]:true},
                      values:{...p.values,[amoeba.id]:"NONE SEEN"}}))}
                    style={{accentColor:C.accent}}/>
                  <span style={{color:val==="NONE SEEN"?C.primary:"#555",fontWeight:val==="NONE SEEN"?700:400}}>None Seen</span>
                  <span style={{marginLeft:8,fontSize:11,color:C.muted,fontStyle:"italic"}}>Sample:</span>
                  <input value={form.values["famoeba_sample"]||""}
                    onChange={e=>setForm(p=>({...p,values:{...p.values,famoeba_sample:e.target.value}}))}
                    style={inp({width:80,fontSize:11,height:24,padding:"0 6px"})}
                    placeholder="type…"/>
                </label>
                <div style={{display:"flex",gap:12,paddingLeft:20}}>
                  <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12}}>
                    <input type="radio" name="para_amoeba" checked={val==="Cyst Seen"}
                      onChange={()=>setForm(p=>({...p,
                        ticked:{...p.ticked,[amoeba.id]:true},
                        values:{...p.values,[amoeba.id]:"Cyst Seen"}}))}
                      style={{accentColor:C.accent}}/>
                    <span style={{color:val==="Cyst Seen"?C.primary:"#555",fontWeight:val==="Cyst Seen"?700:400}}>Cyst Seen</span>
                  </label>
                  <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12}}>
                    <input type="radio" name="para_amoeba" checked={val==="Trophozoites Seen"}
                      onChange={()=>setForm(p=>({...p,
                        ticked:{...p.ticked,[amoeba.id]:true},
                        values:{...p.values,[amoeba.id]:"Trophozoites Seen"}}))}
                      style={{accentColor:C.accent}}/>
                    <span style={{color:val==="Trophozoites Seen"?C.primary:"#555",fontWeight:val==="Trophozoites Seen"?700:400}}>Trophozoites Seen</span>
                  </label>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Flagellates */}
        {flagellates&&renderTest(flagellates,"compact")}

        {/* Others */}
        {others&&renderTest(others,"compact")}
      </div>
    );
  };

    const renderTest=(t,mode)=>{
    const compact=mode==="compact";const single=mode==="single";const chem=mode==="chem";
    const ticked=isTicked(t.id);
    const val=form.values[t.id]||"";
    const flag=val?getFlag(t,val):"";
    const isDropdown=t.inputType==="dropdown"&&t.options?.length>0;
    const useManual=!!manualMode[t.id];
    const rowBg=flag==="HI"?C.redLight:flag==="LO"?C.amberLight:(!ticked?C.surface:"#fff");

    return(
      <div key={t.id} style={{
        display:"grid",gridTemplateColumns:isAutoTickSection?"1fr auto":"30px 1fr auto",gap:"0 8px",
        alignItems:"center",
        padding:compact?"5px 8px":chem?"5px 10px":single?"9px 16px":"7px 12px",
        borderBottom:`1px solid ${C.border}`,
        background:rowBg,
        transition:"background .1s",
        cursor:isAutoTickSection?"default":"pointer"
      }}
        onClick={isAutoTickSection?undefined:()=>toggleTick(t.id)}>

        {/* Checkbox — hidden for auto-tick sections */}
        {!isAutoTickSection&&(
          <input type="checkbox" checked={ticked}
            onChange={e=>{e.stopPropagation();toggleTick(t.id);}}
            onClick={e=>e.stopPropagation()}
            style={{width:15,height:15,cursor:"pointer",accentColor:C.accent}}/>
        )}

        {/* Name + brand */}
        <div style={{minWidth:0}}>
          <div style={{fontWeight:ticked?600:400,fontSize:compact?11:chem?11:single?13:12,color:ticked?C.text:"#555",
            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</div>
          {chem&&t.normalText&&<div style={{fontSize:9,color:C.faint,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.normalText}{t.unit?" · "+t.unit:""}</div>}
          {t.showBrand&&t.brands?.length>0&&ticked&&(
            <select value={form.brands[t.id]||""}
              onChange={e=>{e.stopPropagation();setForm(p=>({...p,brands:{...p.brands,[t.id]:e.target.value}}));}}
              onClick={e=>e.stopPropagation()}
              style={{...inp({fontSize:10,height:22,padding:"0 4px",marginTop:2}),
                color:"#b85c00",background:"#fff3e0",border:"1.5px solid #f0c080",
                fontWeight:600,borderRadius:6,maxWidth:120}}>
              <option value="">— brand —</option>
              {t.brands.map(b=><option key={b} value={b}>{b}</option>)}
            </select>
          )}
        </div>

        {/* Input area */}
        <div style={{display:"flex",alignItems:"center",gap:4}} onClick={e=>e.stopPropagation()}>
          {ticked?(
            <>
              {/* Dropdown toggle button */}
              {isDropdown&&(
                <button
                  title={useManual?"Switch to dropdown":"Switch to manual typing"}
                  onClick={e=>{e.stopPropagation();toggleManual(t.id);}}
                  style={{background:useManual?"#eff6ff":"#f0fdf4",
                    border:`1px solid ${useManual?"#bfdbfe":"#bbf7d0"}`,
                    color:useManual?"#1d4ed8":"#15803d",
                    borderRadius:5,padding:"1px 5px",fontSize:10,fontWeight:700,
                    cursor:"pointer",flexShrink:0,height:24}}>
                  {useManual?"✎":"▾"}
                </button>
              )}

              {/* Input: dropdown or text */}
              {isDropdown&&!useManual?(
                <select value={val}
                  onChange={e=>setForm(p=>({...p,values:{...p.values,[t.id]:e.target.value}}))}
                  style={inp({width:chem?90:110,fontWeight:600,fontSize:chem?11:12,
                    borderColor:flag==="HI"?C.red:flag==="LO"?C.amber:C.border,
                    background:flag==="HI"?C.redLight:flag==="LO"?C.amberLight:"#fff"})}>
                  <option value="">— select —</option>
                  {t.options.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              ):(
                <input value={val}
                  onChange={e=>setForm(p=>({...p,values:{...p.values,[t.id]:e.target.value}}))}
                  style={inp({width:useManual?100:(chem?80:100),textAlign:"right",fontWeight:600,fontSize:chem?11:12,
                    borderColor:flag==="HI"?C.red:flag==="LO"?C.amber:C.border,
                    background:flag==="HI"?C.redLight:flag==="LO"?C.amberLight:"#fff"})}
                  placeholder={useManual?"type value…":"value"}/>
              )}

              {/* Count # input for Casts */}
              {(t.showCount||t.id==="ucasts"||(t.name||"").toLowerCase()==="casts")&&ticked&&(
                <input type="number" min="0"
                  value={form.countValues?.[t.id]||""}
                  onChange={e=>{e.stopPropagation();setForm(p=>({...p,countValues:{...p.countValues,[t.id]:e.target.value}}));}}
                  onClick={e=>e.stopPropagation()}
                  style={inp({width:52,textAlign:"center",fontWeight:600,fontSize:12,height:28,
                    borderColor:"#a78bfa",background:"#f5f3ff",color:"#5b21b6"})}
                  placeholder="# ct" title="Count number"/>
              )}

              {/* Unit */}
              {t.unit&&<span style={{fontSize:10,color:C.muted,whiteSpace:"nowrap"}}>{t.unit}</span>}

              {/* Flag badge */}
              {flag&&(
                <span style={{padding:"1px 6px",borderRadius:8,fontSize:10,fontWeight:700,flexShrink:0,
                  background:flag==="HI"?C.redLight:C.amberLight,
                  color:flag==="HI"?C.red:C.amber}}>{flag}</span>
              )}
            </>
          ):(
            <span style={{fontSize:10,color:C.faint,fontStyle:"italic",whiteSpace:"nowrap"}}>not ordered</span>
          )}
        </div>
      </div>
    );
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Page header */}
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:10,background:secDef?.color+"22",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{secDef?.icon}</div>
        <div>
          <div style={{fontWeight:700,fontSize:18,color:secDef?.color}}>{secDef?.label}</div>
          <div style={{fontSize:11,color:C.muted}}>Result Entry Form</div>
        </div>
        {barcodeMode&&(
          <div style={{marginLeft:"auto",background:"#0d7bbd22",border:"1.5px solid #0d7bbd55",
            borderRadius:8,padding:"6px 14px",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>▦</span>
            <span style={{fontSize:12,fontWeight:600,color:C.accent}}>Barcode Scan Mode</span>
            <span style={{fontSize:11,color:C.muted}}>— Showing only ordered tests</span>
          </div>
        )}
      </div>

      {/* Patient Info */}
      <Card>
        <CardHead title="Patient Information" icon="👤"/>
        <div style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <Field label="Patient *" style={{flex:2,minWidth:240}}>
              <PatientCombo patients={patients} value={form.patientId} onChange={v=>setForm(p=>({...p,patientId:v}))}/>
            </Field>
            {pat&&(
              <>
                <Field label="Age" style={{width:70}}>
                  <input readOnly value={calcAge(pat.dob)} style={inp({background:"#f5f5f5",width:70})}/>
                </Field>
                <Field label="Sex" style={{width:70}}>
                  <input readOnly value={pat.gender||"—"} style={inp({background:"#f5f5f5",width:70})}/>
                </Field>
                <Field label="Date of Birth" style={{width:110}}>
                  <input readOnly value={pat.dob||"—"} style={inp({background:"#f5f5f5",width:110})}/>
                </Field>
              </>
            )}
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <Field label="Date & Time" style={{width:200}}>
              <input type="datetime-local" value={form.datetime} onChange={e=>setForm(p=>({...p,datetime:e.target.value}))} style={inp({width:200})}/>
            </Field>
            <Field label="Ward" style={{width:110}}>
              <input value={form.ward} onChange={e=>setForm(p=>({...p,ward:e.target.value}))} style={inp({width:110})} placeholder="Ward/Room"/>
            </Field>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <Field label="Physician" style={{flex:1,minWidth:200}}>
              <StaffDrop staff={staff} roles={["Physician"]} value={form.physician}
                onChange={v=>setForm(p=>({...p,physician:v}))} placeholder="Select physician…"/>
            </Field>
            <Field label="Pathologist" style={{flex:1,minWidth:200}}>
              <StaffDrop staff={staff} roles={["Pathologist"]} value={form.pathologist}
                onChange={v=>setForm(p=>({...p,pathologist:v}))} placeholder="Select pathologist…"/>
            </Field>
            <Field label="Med. Technologist (Performed By)" style={{flex:1,minWidth:200}}>
              <StaffDrop staff={staff} roles={["Medical Technologist","Med. Technologist"]} value={form.medtech}
                onChange={v=>setForm(p=>({...p,medtech:v}))} placeholder="Select med. tech…"/>
            </Field>
            <Field label="Validated By (Med. Tech.)" style={{flex:1,minWidth:200}}>
              <StaffDrop staff={staff} roles={["Medical Technologist","Med. Technologist"]} value={form.validatedBy}
                onChange={v=>setForm(p=>({...p,validatedBy:v}))} placeholder="Select validator…"/>
            </Field>
          </div>
        </div>
      </Card>

      {/* Tests Card */}
      <Card>
        <CardHead title="Test Results"
          sub={isAutoTickSection?"All tests included automatically":`Tick tests to include — ${tickedCount} selected. Click row or checkbox to tick.`}
          right={
            !isAutoTickSection&&(
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <button style={Btn("ghost",{fontSize:11,height:26})} onClick={tickAll}>✓ Tick All</button>
              <button style={Btn("ghost",{fontSize:11,height:26})} onClick={untickAll}>✗ Clear All</button>
            </div>
            )
          }/>

        <div style={{padding:"4px 0"}}>
          {groups.length===0&&(
            <div style={{padding:24,textAlign:"center",color:C.muted,fontSize:12}}>
              No tests configured. Go to ⚙ Parameters to add tests.
            </div>
          )}

          {/* ── Unified 2-column layout for all sections ── */}
          {(()=>{
            // Color header per section
            const hdrColor=secDef?.color||"#1a3a5c";

            // Filter tests for barcode mode (hide non-ordered tests)
            const filterTests=(tests)=>barcodeMode?tests.filter(t=>preSet.has(t.id)):tests;
            const filterGroups=(grps)=>barcodeMode
              ?grps.map(g=>({...g,tests:filterTests(g.tests)})).filter(g=>g.tests.length>0)
              :grps;

            // ── Helper: render a group with compact rows
            const renderCompactGroup=(grp)=>{
              const visTests=filterTests(grp.tests);
              if(visTests.length===0)return null;
              return(
              <div key={grp.group}>
                <div style={{padding:"5px 10px",background:C.surface,
                  borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,
                  display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontWeight:700,fontSize:10,color:C.primary,
                    letterSpacing:".05em",textTransform:"uppercase"}}>{grp.group}</span>
                  {groupHasNegative(grp)&&(
                    <button style={{...Btn("ghost",{fontSize:10,height:20,padding:"0 7px"}),
                      background:"#f0fdf4",color:"#15803d",border:"1px solid #bbf7d0"}}
                      onClick={()=>setAllNegative(grp)}>✓ All Neg</button>
                  )}
                </div>
                {visTests.map(t=>renderTest(t,"compact"))}
              </div>
              );
            };

            // ── Fecalysis: Macroscopic+Microscopic | Parasitology
            if(section==="fecalysis"){
              const leftGroups=groups.filter(g=>g.group!=="Parasitology");
              const paraGroup=groups.find(g=>g.group==="Parasitology");
              return(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,
                  borderTop:`1px solid ${C.border}`}}>
                  <div style={{borderRight:`2px solid ${C.border}`}}>
                    <div style={{padding:"7px 12px",background:hdrColor,textAlign:"center"}}>
                      <span style={{fontWeight:700,fontSize:12,color:"#fff",letterSpacing:1}}>MACROSCOPIC &amp; MICROSCOPIC</span>
                    </div>
                    {leftGroups.map(g=>renderCompactGroup(g))}
                  </div>
                  <div>
                    <div style={{padding:"7px 12px",background:hdrColor,textAlign:"center"}}>
                      <span style={{fontWeight:700,fontSize:12,color:"#fff",letterSpacing:1}}>PARASITOLOGY</span>
                    </div>
                    {paraGroup&&renderParasitology(paraGroup)}
                  </div>
                </div>
              );
            }

            // ── Urinalysis: Physical+Chemical | Microscopic
            if(section==="urinalysis"){
              const leftGroups=groups.filter(g=>g.group!=="Microscopic Examination");
              const rightGroup=groups.find(g=>g.group==="Microscopic Examination");
              return(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,
                  borderTop:`1px solid ${C.border}`}}>
                  <div style={{borderRight:`2px solid ${C.border}`}}>
                    <div style={{padding:"7px 12px",background:hdrColor,textAlign:"center"}}>
                      <span style={{fontWeight:700,fontSize:12,color:"#fff",letterSpacing:1}}>PHYSICAL &amp; CHEMICAL</span>
                    </div>
                    {leftGroups.map(g=>renderCompactGroup(g))}
                  </div>
                  <div>
                    <div style={{padding:"7px 12px",background:hdrColor,textAlign:"center"}}>
                      <span style={{fontWeight:700,fontSize:12,color:"#fff",letterSpacing:1}}>MICROSCOPIC</span>
                    </div>
                    {rightGroup&&renderCompactGroup(rightGroup)}
                  </div>
                </div>
              );
            }

            // ── bloodchem: single column with bold section headers (light pink theme)
            // ── all other sections: 2-column grid per group
            const isSingleCol=section==="bloodchem";
            // Light pink tints for bloodchem
            const chemHdrBg="#fce4ec";      // very light pink header background
            const chemHdrText="#c2185b";    // deep pink text
            const chemRowAlt="#fdf0f4";     // barely-there pink stripe
            return filterGroups(groups).map(grp=>(
              <div key={grp.group}>
                <div style={{
                  padding:"7px 14px",
                  background:isSingleCol?chemHdrBg:C.surface,
                  borderTop:`1px solid ${isSingleCol?"#f8bbd0":C.border}`,
                  borderBottom:`1px solid ${isSingleCol?"#f8bbd0":C.border}`,
                  display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{
                    fontWeight:700,
                    fontSize:isSingleCol?12:11,
                    color:isSingleCol?chemHdrText:C.primary,
                    letterSpacing:isSingleCol?".03em":".05em",
                    textTransform:isSingleCol?"none":"uppercase"
                  }}>{grp.group}</span>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    {!isSingleCol&&<span style={{fontSize:10,color:C.muted}}>{grp.tests.length} test{grp.tests.length!==1?"s":""}</span>}
                    {groupHasNegative(grp)&&(
                      <button style={{...Btn("ghost",{fontSize:10,height:22,padding:"0 8px"}),
                        background:"#f0fdf4",color:"#15803d",border:"1px solid #bbf7d0"}}
                        onClick={()=>setAllNegative(grp)}>✓ All Negative</button>
                    )}
                  </div>
                </div>
                {isSingleCol?(
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,background:chemRowAlt}}>
                    {filterTests(grp.tests).map(t=>renderTest(t,"chem"))}
                    {grp.tests.length%2!==0&&<div style={{background:chemRowAlt,borderBottom:`1px solid #f8bbd0`}}/>}
                  </div>
                ):(
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
                    {filterTests(grp.tests).map(t=>renderTest(t))}
                    {grp.tests.length%2!==0&&(
                      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`}}/>
                    )}
                  </div>
                )}
              </div>
            ));
          })()}
        </div>

        {/* Remarks — chem, hematology, serology only */}
        {(section==="bloodchem"||section==="hematology"||section==="serology")&&(
          <div style={{padding:"10px 16px",borderTop:`1px solid ${C.border}`,background:"#fafbfc"}}>
            <div style={{fontSize:11,fontWeight:700,color:C.primary,marginBottom:6,
              display:"flex",alignItems:"center",gap:6}}>
              📝 Remarks / Comments
              <span style={{fontSize:10,fontWeight:400,color:C.faint}}>(optional — printed below results)</span>
            </div>
            <textarea value={form.remark||""} onChange={e=>setForm(p=>({...p,remark:e.target.value}))}
              rows={3} placeholder="e.g. Specimen ran twice with consistent result. Hemolyzed sample noted. Please correlate clinically…"
              style={{width:"100%",padding:"8px 10px",border:`1.5px solid ${C.border}`,borderRadius:6,
                fontSize:12,fontFamily:"inherit",resize:"vertical",outline:"none",color:C.text,
                background:"#fff",boxSizing:"border-box",lineHeight:1.5}}/>
          </div>
        )}

        {/* Legend + Save */}
        <div style={{padding:"10px 16px",borderTop:`1px solid ${C.border}`,
          background:C.surface,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",gap:12,alignItems:"center",fontSize:11,color:C.muted}}>
            <span>▾ = dropdown</span>
            <span>✎ = switch to manual</span>
            <span style={{background:C.redLight,color:C.red,padding:"1px 7px",borderRadius:6,fontWeight:700}}>HI</span>
            <span style={{background:C.amberLight,color:C.amber,padding:"1px 7px",borderRadius:6,fontWeight:700}}>LO</span>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={Btn("ghost")} onClick={clear}>Clear</button>
            <button style={Btn("primary")} onClick={handleSave}>💾 Save Result</button>
          </div>
        </div>
      </Card>
    </div>
  );
}


/* ══════════════════════════════════════════════════════
   SUMMARY VIEW
══════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════
   SUMMARY VIEW  — daily census table per section
══════════════════════════════════════════════════════ */
function SummaryView({results,patients,hospital}){
  const [date,setDate]=useState(toInputDate());
  // null = selection screen, string = show that section's table
  const [activeSec,setActiveSec]=useState(null);
  const getP=id=>patients.find(p=>p.id===id);

  const dayResults=results.filter(r=>r.date===date);
  const sectionsWithData=SECTIONS.filter(s=>dayResults.some(r=>r.section===s.id));
  const totalToday=dayResults.length;

  // ── Generate a real landscape PDF using jsPDF + autoTable ──
  const generateSummaryPDF=async(sections)=>{
    const doc=new jsPDF({orientation:"landscape",unit:"mm",format:"a4"});
    const W=297, grey=[80,80,80], black=[0,0,0], navy=[0,0,0];
    const fmtPrintDate=new Date(date+"T12:00:00").toLocaleDateString("en-US",
      {year:"numeric",month:"long",day:"numeric"});
    let isFirstPage=true;

    for(const sec of sections){
      const secR=dayResults.filter(r=>r.section===sec.id);
      if(secR.length===0)continue;
      const sectColor=SECTION_COLORS[sec.id]||[60,60,60];
      const testNames=[...new Set(secR.flatMap(r=>(r.lines||[]).map(l=>l.testName)))];

      if(!isFirstPage)doc.addPage("a4","landscape");
      isFirstPage=false;

      let y=10;

      // ── Page header ──
      doc.setFont("times","bold");
      doc.setFontSize(13);doc.setTextColor(...navy);
      doc.text(hospital?.name||"CLINICAL LABORATORY",W/2,y,{align:"center"});
      y+=5;
      doc.setFontSize(8);doc.setFont("times","normal");doc.setTextColor(...grey);
      if(hospital?.address){doc.text(hospital.address,W/2,y,{align:"center"});y+=4;}
      if(hospital?.phone){doc.text("Tel: "+hospital.phone,W/2,y,{align:"center"});y+=4;}
      doc.text("Laboratory Department",W/2,y,{align:"center"});y+=4;
      doc.setFont("times","bold");doc.setFontSize(10);doc.setTextColor(...navy);
      doc.text("DAILY LABORATORY SUMMARY — "+fmtPrintDate.toUpperCase(),W/2,y,{align:"center"});
      y+=3;
      doc.setDrawColor(0,0,0);doc.setLineWidth(0.5);doc.line(10,y,W-10,y);
      y+=5;

      // ── Section title bar ──
      doc.setFillColor(...sectColor);
      doc.roundedRect(10,y,W-20,6,1,1,"F");
      doc.setFont("times","bold");doc.setFontSize(9);doc.setTextColor(255,255,255);
      doc.text(sec.label.toUpperCase()+"   ·   "+secR.length+" patient"+(secR.length!==1?"s":""),
        W/2,y+4,{align:"center"});
      y+=9;

      // ── Build table columns ──
      // Fixed columns: No / Name / DOB / Age / Sex / Ward / Address
      // Dynamic columns: one per test name
      const fixedCols=["No.","Name","DOB","Age","Sex","Ward","Address"];
      const head=[...fixedCols,...testNames];

      const body=secR.map((r,i)=>{
        const p=getP(r.patientId);
        const dob=p?.dob?new Date(p.dob).toLocaleDateString("en-US",
          {month:"2-digit",day:"2-digit",year:"numeric"}):"—";
        const fixed=[
          String(i+1),
          p?.name||"—",
          dob,
          calcAge(p?.dob)||"—",
          p?.gender?p.gender[0]:"—",
          r.ward||"—",
          p?.address||"—",
        ];
        const testCells=testNames.map(tn=>{
          const line=(r.lines||[]).find(l=>l.testName===tn);
          return line?.value||"";
        });
        return [...fixed,...testCells];
      });

      // Column width calculation — fixed cols get set widths, tests share the rest
      const usable=W-20;
      const fixedWidths=[8,36,18,8,6,12,28]; // No/Name/DOB/Age/Sex/Ward/Address
      const fixedTotal=fixedWidths.reduce((a,b)=>a+b,0);
      const testW=testNames.length>0
        ?Math.max(10,Math.floor((usable-fixedTotal)/testNames.length))
        :10;
      const colStyles={};
      fixedWidths.forEach((w,i)=>{
        colStyles[i]={cellWidth:w,halign:i===1||i===6?"left":"center"};
      });
      testNames.forEach((_,i)=>{
        colStyles[fixedCols.length+i]={cellWidth:testW,halign:"center",fontStyle:"bold"};
      });

      // Pastel section fill for alternating rows
      const [r0,g0,b0]=sectColor;
      const lightFill=[
        Math.round(r0+(255-r0)*0.88),
        Math.round(g0+(255-g0)*0.88),
        Math.round(b0+(255-b0)*0.88),
      ];

      doc.autoTable({
        startY:y,
        head:[head],
        body,
        margin:{left:10,right:10},
        styles:{font:"times",fontSize:7,cellPadding:1.2,textColor:black,overflow:"ellipsize"},
        headStyles:{fillColor:sectColor,textColor:[255,255,255],fontStyle:"bold",fontSize:6.5,
          halign:"center",valign:"middle"},
        columnStyles:colStyles,
        alternateRowStyles:{fillColor:lightFill},
        // Flag HI/LO cells in red/blue
        didParseCell(data){
          if(data.section==="body"&&data.column.index>=fixedCols.length){
            const ri=data.row.index;
            const ti=data.column.index-fixedCols.length;
            const tn=testNames[ti];
            const r2=secR[ri];
            const line=r2?(r2.lines||[]).find(l=>l.testName===tn):null;
            if(line?.flag==="HI")data.cell.styles.textColor=[192,57,43];
            else if(line?.flag==="LO")data.cell.styles.textColor=[26,111,181];
          }
        },
      });
    }

    // ── Save as PDF and open in built-in viewer (same as results) ──
    const filename=`Summary_${date.replace(/-/g,"")}.pdf`;
    if(window.electronAPI && window.electronAPI.savePDF){
      const base64=doc.output("datauristring").split(",")[1];
      const saved=await window.electronAPI.savePDF(filename,base64);
      if(saved.success){
        await window.electronAPI.printPDF(saved.filePath,filename);
      }
    } else {
      // Browser fallback
      const dataUri=doc.output("datauristring");
      const a=document.createElement("a");
      a.href=dataUri;a.download=filename;
      document.body.appendChild(a);a.click();document.body.removeChild(a);
    }
  };

  // ── Print handler ──
  const handlePrint=async(sectsToPrint)=>{
    const sections=sectsToPrint||(activeSec
      ?sectionsWithData.filter(s=>s.id===activeSec)
      :sectionsWithData);
    if(sections.length===0)return alert("No results to print for this date.");
    await generateSummaryPDF(sections);
  };

  // ── Section selection screen (like Dashboard) ──
  const SelectionScreen=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {[
          {label:"Total Results Today",value:totalToday,icon:"📋",color:"#166534",bg:"#dcfce7",border:"#bbf7d0"},
          {label:"Sections Active",value:sectionsWithData.length,icon:"🔬",color:"#1e5fa8",bg:"#dbeafe",border:"#bfdbfe"},
          {label:"Selected Date",value:new Date(date+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),icon:"📅",color:"#5b21b6",bg:"#ede9fe",border:"#ddd6fe"},
        ].map(k=>(
          <div key={k.label} style={{background:k.bg,border:`1px solid ${k.border}`,borderRadius:10,
            padding:"14px 18px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:42,height:42,borderRadius:10,background:"rgba(255,255,255,0.6)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{k.icon}</div>
            <div>
              <div style={{fontSize:22,fontWeight:700,color:k.color,lineHeight:1,letterSpacing:"-.02em"}}>{k.value}</div>
              <div style={{fontSize:11,color:"#555",marginTop:3,fontWeight:500}}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Section graphic cards */}
      {sectionsWithData.length===0?(
        <div style={{textAlign:"center",padding:56,color:C.muted,fontSize:13,
          background:"#fff",borderRadius:12,boxShadow:"0 1px 4px rgba(0,0,0,.06)",
          border:`1px solid ${C.border}`}}>
          <div style={{fontSize:40,marginBottom:12}}>📭</div>
          <div style={{fontWeight:600,marginBottom:4}}>No results for {fmtDate(date)}</div>
          <div style={{fontSize:12,color:C.faint}}>Change the date above or enter results first.</div>
        </div>
      ):(
        <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:13,fontWeight:600,color:C.text}}>Select a section to view its summary:</div>
            <button
              style={{...Btn("primary",{fontSize:12}),gap:6}}
              onClick={()=>handlePrint(sectionsWithData)}>
              🖨 Print All Sections
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {sectionsWithData.map(s=>{
              const cnt=dayResults.filter(r=>r.section===s.id).length;
              const isBC=s.id==="bloodchem";
              const cardBg=isBC?"#fff0f5":"#fff";
              const borderCol=isBC?"#f48fb133":s.color+"30";
              return(
                <button key={s.id}
                  onClick={()=>setActiveSec(s.id)}
                  style={{background:cardBg,border:`1.5px solid ${borderCol}`,borderRadius:11,
                    padding:"18px 18px 14px",cursor:"pointer",textAlign:"left",
                    transition:"all .18s",fontFamily:"inherit",
                    boxShadow:"0 1px 4px rgba(0,0,0,.05)"}}
                  onMouseEnter={e=>{
                    e.currentTarget.style.background=isBC?"#fce4ec":s.color+"0e";
                    e.currentTarget.style.borderColor=isBC?"#f48fb160":s.color+"60";
                    e.currentTarget.style.transform="translateY(-2px)";
                    e.currentTarget.style.boxShadow="0 6px 18px rgba(0,0,0,.1)";
                  }}
                  onMouseLeave={e=>{
                    e.currentTarget.style.background=cardBg;
                    e.currentTarget.style.borderColor=borderCol;
                    e.currentTarget.style.transform="";
                    e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,.05)";
                  }}>
                  <div style={{fontSize:28,marginBottom:8}}>{s.icon}</div>
                  <div style={{fontWeight:700,fontSize:13,color:isBC?"#c2185b":s.color,
                    letterSpacing:"-.01em",marginBottom:4}}>{s.label}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:11,color:C.faint,fontWeight:500}}>
                      {cnt} result{cnt!==1?"s":""}
                    </div>
                    <span style={{fontSize:10,color:isBC?"#c2185b":s.color,fontWeight:700,
                      background:isBC?"#fce4ec":s.color+"15",padding:"2px 8px",borderRadius:6}}>
                      View →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );

  // ── Table view for a single section ──
  const sec=SECTIONS.find(s=>s.id===activeSec);
  const secR=activeSec?dayResults.filter(r=>r.section===activeSec):[];
  const testNames=activeSec?[...new Set(secR.flatMap(r=>(r.lines||[]).map(l=>l.testName)))]:[]; 
  const isBC=activeSec==="bloodchem";

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>

      {/* ── Top header with date picker ── */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {activeSec&&(
            <button onClick={()=>setActiveSec(null)}
              style={{...Btn("ghost",{height:32,fontSize:12,padding:"0 12px"}),gap:6}}>
              ← Back
            </button>
          )}
          <div>
            <div style={{fontWeight:700,fontSize:18,color:C.text}}>
              {activeSec?`${sec?.icon} ${sec?.label} — Summary`:"📋 Daily Summary"}
            </div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>
              {activeSec?"Daily census table for this section":"Select a section to view its results"}
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <Field label="Date" style={{width:155}}>
            <input type="date" value={date}
              onChange={e=>{setDate(e.target.value);setActiveSec(null);}}
              style={inp({width:155})}/>
          </Field>
          {activeSec&&(
            <button style={{...Btn("primary",{fontSize:12}),marginTop:18}}
              onClick={()=>handlePrint(null)}>
              🖨 Print This Section
            </button>
          )}
        </div>
      </div>

      {/* ── Content: selection grid OR table ── */}
      {!activeSec?(
        <SelectionScreen/>
      ):(
        <div style={{background:"#fff",borderRadius:10,
          boxShadow:"0 1px 4px rgba(0,0,0,.07)",overflow:"hidden",
          border:`1px solid ${isBC?"#f8bbd0":C.border}`}}>
          {/* Section table header bar */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
            padding:"10px 16px",
            background:isBC?"#fce4ec":sec?.color,
            color:isBC?"#c2185b":"#fff"}}>
            <span style={{fontWeight:700,fontSize:13}}>{sec?.icon} {sec?.label}</span>
            <span style={{
              background:isBC?"rgba(194,24,91,0.15)":"rgba(255,255,255,.25)",
              borderRadius:20,padding:"2px 12px",fontSize:12,fontWeight:700,
              color:isBC?"#c2185b":"#fff"}}>
              {secR.length} patient{secR.length!==1?"s":""}
            </span>
          </div>

          {secR.length===0?(
            <div style={{padding:40,textAlign:"center",color:C.faint,fontSize:12}}>
              No results for this section on {fmtDate(date)}.
            </div>
          ):(
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,minWidth:600}}>
                <thead>
                  <tr style={{background:isBC?"#fce4ec":C.surface,
                    borderBottom:`1px solid ${isBC?"#f8bbd0":C.border}`}}>
                    {["No.","Name","Birth Date","Age","Sex","Ward","Address",...testNames].map(h=>(
                      <th key={h} style={{padding:"5px 8px",textAlign:"left",fontSize:10,
                        fontWeight:700,
                        color:isBC?"#c2185b":C.primary,
                        textTransform:"uppercase",letterSpacing:".03em",
                        whiteSpace:"nowrap",borderRight:`1px solid ${isBC?"#f8bbd0":C.border}`}}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {secR.map((r,i)=>{
                    const p=getP(r.patientId);
                    const dob=p?.dob?new Date(p.dob).toLocaleDateString("en-US",
                      {month:"2-digit",day:"2-digit",year:"numeric"}):"—";
                    const rowBg=i%2===0?"#fff":isBC?"#fdf0f4":C.surface;
                    return(
                      <tr key={r.id} style={{borderBottom:`1px solid ${isBC?"#f8bbd0":C.border}`,background:rowBg}}>
                        <td style={{padding:"5px 8px",textAlign:"center",color:C.muted,borderRight:`1px solid ${isBC?"#f8bbd0":C.border}`}}>{i+1}</td>
                        <td style={{padding:"5px 8px",fontWeight:600,whiteSpace:"nowrap",borderRight:`1px solid ${isBC?"#f8bbd0":C.border}`}}>{p?.name||"—"}</td>
                        <td style={{padding:"5px 8px",whiteSpace:"nowrap",color:C.muted,borderRight:`1px solid ${isBC?"#f8bbd0":C.border}`}}>{dob}</td>
                        <td style={{padding:"5px 8px",textAlign:"center",color:C.muted,borderRight:`1px solid ${isBC?"#f8bbd0":C.border}`}}>{calcAge(p?.dob)||"—"}</td>
                        <td style={{padding:"5px 8px",textAlign:"center",color:C.muted,borderRight:`1px solid ${isBC?"#f8bbd0":C.border}`}}>{p?.gender?p.gender[0]:"—"}</td>
                        <td style={{padding:"5px 8px",textAlign:"center",color:C.muted,borderRight:`1px solid ${isBC?"#f8bbd0":C.border}`}}>{r.ward||"—"}</td>
                        <td style={{padding:"5px 8px",color:C.muted,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",borderRight:`1px solid ${isBC?"#f8bbd0":C.border}`}}>{p?.address||"—"}</td>
                        {testNames.map(tn=>{
                          const line=(r.lines||[]).find(l=>l.testName===tn);
                          const flag=line?.flag;
                          return(
                            <td key={tn} style={{padding:"5px 8px",textAlign:"center",
                              borderRight:`1px solid ${isBC?"#f8bbd0":C.border}`,
                              fontWeight:flag?700:400,
                              color:flag==="HI"?C.red:flag==="LO"?"#1d4ed8":C.text,
                              maxWidth:90,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                              {line?.value||""}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   REPORTS VIEW
══════════════════════════════════════════════════════ */
function ReportsView({results,patients,staff,onPrint,onBatchPrint,onDelete,onEdit}){
  const [activeTab,setActiveTab]=useState("all");
  const [searches,setSearches]=useState({});  // per-section search
  const [sortBy,setSortBy]=useState("date_desc");
  const [filterDate,setFilterDate]=useState("");  // "" = all dates
  const [resultPage,setResultPage]=useState(1);  // pagination for large result sets
  const RESULTS_PER_PAGE=100;
  const [sel,setSel]=useState(null);
  // Keep sel in sync with results array so printed status, edits etc. reflect immediately
  useEffect(()=>{
    if(sel){
      const fresh=results.find(r=>r.id===sel.id);
      if(fresh&&(fresh.printed!==sel.printed||fresh.printedAt!==sel.printedAt||fresh.ward!==sel.ward))setSel(fresh);
    }
  },[results]);
  const [editMode,setEditMode]=useState(false);
  const [editLines,setEditLines]=useState([]);
  const [batchMode,setBatchMode]=useState(false);
  const [checked,setChecked]=useState({});
  const getP=id=>patients.find(p=>p.id===id);

  const toggleCheck=id=>setChecked(prev=>({...prev,[id]:!prev[id]}));
  const checkedIds=Object.keys(checked).filter(id=>checked[id]);
  const exitBatch=()=>{setBatchMode(false);setChecked({});};

  const startEdit=()=>{setEditLines(sel.lines.map(l=>({...l})));setEditMode(true);setEditWard(sel.ward||"");setEditPhysician(sel.physician||"");setEditMedtech(sel.medtech||"");setEditPathologist(sel.pathologist||"");setEditValidatedBy(sel.validatedBy||"");setEditRemark(sel.remark||"");};
  const cancelEdit=()=>{setEditMode(false);setEditLines([]);setEditWard("");setEditPhysician("");setEditMedtech("");setEditPathologist("");setEditValidatedBy("");setEditRemark("");};
  const [editWard,setEditWard]=useState("");
  const [editPhysician,setEditPhysician]=useState("");
  const [editMedtech,setEditMedtech]=useState("");
  const [editPathologist,setEditPathologist]=useState("");
  const [editValidatedBy,setEditValidatedBy]=useState("");
  const [editRemark,setEditRemark]=useState("");
  const saveEdit=()=>{
    const updated={...sel,ward:editWard,physician:editPhysician,
      remark:editRemark,
      medtech:editMedtech,medtechLic:(staff?.find(s=>s.name===editMedtech)?.licenseNo||sel.medtechLic||""),
      pathologist:editPathologist,pathologistLic:(staff?.find(s=>s.name===editPathologist)?.licenseNo||sel.pathologistLic||""),
      validatedBy:editValidatedBy,validatedByLic:(staff?.find(s=>s.name===editValidatedBy)?.licenseNo||sel.validatedByLic||""),
      lines:editLines.map(l=>{
      const n=parseFloat(l.value);
      let flag="";
      if(!isNaN(n)){
        const _mn2=parseFloat(l.normalMin);const _mx2=parseFloat(l.normalMax);
        if(l.normalMin!==undefined&&l.normalMin!==""&&!isNaN(_mn2)&&n<_mn2)flag="LO";
        else if(l.normalMax!==undefined&&l.normalMax!==""&&!isNaN(_mx2)&&n>_mx2)flag="HI";
      }
      return {...l,flag};
    }).filter(l=>l.testName.trim()!=="")};
    onEdit(updated);setSel(updated);setEditMode(false);setEditLines([]);
  };
  const addEditLine=()=>{
    setEditLines(prev=>[...prev,{testName:"",value:"",unit:"",normalRange:"",normalMin:"",normalMax:"",flag:"",showUnit:true,showNormal:true,showFlag:true}]);
  };
  const removeEditLine=(i)=>{setEditLines(prev=>prev.filter((_,j)=>j!==i));};

  // Sort function
  const sortResults=(arr)=>{
    return [...arr].sort((a,b)=>{
      const pa=getP(a.patientId), pb=getP(b.patientId);
      switch(sortBy){
        case"date_desc": return new Date(b.date)-new Date(a.date);
        case"date_asc":  return new Date(a.date)-new Date(b.date);
        case"name_az":   return (pa?.name||"").localeCompare(pb?.name||"");
        case"name_za":   return (pb?.name||"").localeCompare(pa?.name||"");
        case"resultno":  return a.resultNo.localeCompare(b.resultNo);
        case"flags":
          const fa=a.lines?.filter(l=>l.flag).length||0;
          const fb=b.lines?.filter(l=>l.flag).length||0;
          return fb-fa;
        case"not_printed":
          const pa2=a.printed?1:0, pb2=b.printed?1:0;
          return pa2-pb2 || new Date(b.date)-new Date(a.date);
        default: return 0;
      }
    });
  };

  // Reset page when tab, search, or filter changes
  useEffect(()=>{setResultPage(1);},[activeTab,filterDate,searches]);

  // Get results for a tab (section id or "all")
  const getTabResults=(tabId)=>{
    const q=(searches[tabId]||"").toLowerCase().trim();
    let list=tabId==="all"?results:results.filter(r=>r.section===tabId);
    if(filterDate) list=list.filter(r=>r.date===filterDate);
    if(q){
      list=list.filter(r=>{
        const p=getP(r.patientId);
        return(p?.name||"").toLowerCase().includes(q)
          ||r.resultNo.toLowerCase().includes(q)
          ||(r.date||"").includes(q)
          ||(r.sectionLabel||"").toLowerCase().includes(q)
          ||(p?.pid||"").toLowerCase().includes(q);
      });
    }
    return sortResults(list);
  };

  // Reset to page 1 whenever tab, search, or date filter changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allFiltered=getTabResults(activeTab);
  const totalPages=Math.max(1,Math.ceil(allFiltered.length/RESULTS_PER_PAGE));
  const filtered=allFiltered.slice((resultPage-1)*RESULTS_PER_PAGE,resultPage*RESULTS_PER_PAGE);
  const allChecked=filtered.length>0&&filtered.every(r=>checked[r.id]);
  const toggleAll=()=>{
    if(allChecked){setChecked({});}
    else{const n={};filtered.forEach(r=>{n[r.id]=true;});setChecked(n);}
  };
  const doBatchPrint=()=>{
    const toBatch=filtered.filter(r=>checked[r.id]);
    if(toBatch.length===0)return alert("No results selected.");
    // Build a queue array with _batch=true so silent print is used
    const batchQueue=[...toBatch];
    batchQueue._batch=true;
    // Use a single setPrintQ call with the whole batch
    onBatchPrint(batchQueue);
    exitBatch();
  };

  // Tab definitions: All + each section
  const tabs=[
    {id:"all",label:"All",icon:"📋",color:C.primary},
    ...SECTIONS.map(s=>({id:s.id,label:s.label,icon:s.icon,color:s.color}))
  ];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div style={{fontWeight:700,fontSize:18,color:C.text}}>📊 Reports &amp; Result History</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {/* Date filter */}
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:11,color:C.muted,whiteSpace:"nowrap"}}>📅 Date:</span>
            <input type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)}
              style={{...inp({width:138}),height:30,fontSize:12,padding:"0 8px"}}/>
            {filterDate&&(
              <button style={{...Btn("ghost",{height:30,fontSize:11,padding:"0 8px"}),color:C.red}}
                onClick={()=>setFilterDate("")} title="Clear date filter">✕</button>
            )}
          </div>
          {/* Sort dropdown */}
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:11,color:C.muted,whiteSpace:"nowrap"}}>Sort:</span>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
              style={{...inp({width:145}),height:30,fontSize:12,padding:"0 8px"}}>
              <option value="date_desc">Newest first</option>
              <option value="date_asc">Oldest first</option>
              <option value="name_az">Name A → Z</option>
              <option value="name_za">Name Z → A</option>
              <option value="resultno">Result No.</option>
              <option value="flags">Abnormal first</option>
              <option value="not_printed">Not Printed first</option>
            </select>
          </div>
          {!batchMode
            ?<button style={Btn("ghost",{height:30,fontSize:12})} onClick={()=>{setBatchMode(true);setChecked({});}}>☑ Batch Print</button>
            :<>
              <button style={Btn("primary",{height:30,fontSize:12})} onClick={doBatchPrint}>🖨 Print ({checkedIds.length})</button>
              <button style={Btn("ghost",{height:30,fontSize:12})} onClick={exitBatch}>✕ Cancel</button>
            </>
          }
        </div>
      </div>

      {/* Section Tabs */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {tabs.map(tab=>{
          const cnt=tab.id==="all"?results.length:results.filter(r=>r.section===tab.id).length;
          const active=activeTab===tab.id;
          return(
            <button key={tab.id} onClick={()=>{setActiveTab(tab.id);setSel(null);}}
              style={{
                display:"flex",alignItems:"center",gap:6,
                padding:"7px 14px",border:"none",borderRadius:8,cursor:"pointer",
                fontFamily:"inherit",fontSize:12,fontWeight:active?700:500,
                background:active?(tab.color||C.accent):C.surface,
                color:active?"#fff":(tab.color||C.muted),
                boxShadow:active?"0 2px 8px rgba(0,0,0,0.15)":"none",
                border:`1.5px solid ${active?"transparent":(tab.color+"33"||C.border)}`,
                transition:"all .15s"
              }}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span style={{
                background:active?"rgba(255,255,255,0.25)":(tab.color||C.accent)+"18",
                color:active?"#fff":(tab.color||C.accent),
                borderRadius:10,padding:"0 7px",fontSize:11,fontWeight:700,minWidth:22,textAlign:"center"
              }}>{cnt}</span>
            </button>
          );
        })}
      </div>

      {/* Search box for active tab */}
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <div style={{position:"relative",flex:1,maxWidth:400}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:14}}>🔍</span>
          <input
            value={searches[activeTab]||""}
            onChange={e=>setSearches(prev=>({...prev,[activeTab]:e.target.value}))}
            style={{...inp({paddingLeft:32,width:"100%"})}}
            placeholder={`Search in ${tabs.find(t=>t.id===activeTab)?.label||"all"}…`}
          />
          {searches[activeTab]&&(
            <button onClick={()=>setSearches(prev=>({...prev,[activeTab]:""}))}
              style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",
                background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:14,padding:0}}>✕</button>
          )}
        </div>
        <span style={{fontSize:12,color:C.muted,whiteSpace:"nowrap"}}>
          {allFiltered.length} record{allFiltered.length!==1?"s":""}
          {searches[activeTab]&&` for "${searches[activeTab]}"`}
          {totalPages>1&&` · Page ${resultPage}/${totalPages}`}
        </span>
      </div>

      {/* Main content: list + detail */}
      <div style={{display:"flex",gap:14,flex:1}}>

        {/* Result List */}
        <Card style={{width:340,flexShrink:0,overflow:"hidden"}}>
          <div style={{padding:"8px 14px",borderBottom:`1px solid ${C.border}`,
            display:"flex",alignItems:"center",justifyContent:"space-between",background:C.surface}}>
            <span style={{fontWeight:700,fontSize:13,color:C.text}}>
              {tabs.find(t=>t.id===activeTab)?.icon} {tabs.find(t=>t.id===activeTab)?.label}
            </span>
            {batchMode&&(
              <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.muted,cursor:"pointer",userSelect:"none"}}>
                <input type="checkbox" checked={allChecked} onChange={toggleAll}
                  style={{width:14,height:14,cursor:"pointer",accentColor:C.accent}}/>
                All
              </label>
            )}
          </div>

          <div style={{maxHeight:"calc(100vh - 360px)",overflowY:"auto"}}>
            {allFiltered.length===0&&(
              <div style={{padding:32,textAlign:"center",color:C.faint,fontSize:12}}>
                <div style={{fontSize:28,marginBottom:8}}>🔍</div>
                No results found.
              </div>
            )}
            {filtered.map((r)=>{
              const p=getP(r.patientId);
              const sec=SECTIONS.find(s=>s.id===r.section);
              const flags=r.lines?.filter(l=>l.flag).length||0;
              const active=sel?.id===r.id;
              const isChecked=!!checked[r.id];
              const wasPrinted=!!r.printed;
              return(
                <div key={r.id}
                  onClick={()=>batchMode?toggleCheck(r.id):setSel(r)}
                  style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",
                    background:isChecked?"#eef6ff":active?C.accentLight:wasPrinted?"#f0fdf4":"#fff",
                    borderLeft:isChecked?`3px solid ${C.accent}`:active?`3px solid ${C.accent}`:wasPrinted?`3px solid #86efac`:`3px solid transparent`,
                    transition:"background .1s"}}
                  onMouseEnter={e=>{ if(!active&&!isChecked)e.currentTarget.style.background=wasPrinted?"#dcfce7":"#f5f8ff"; }}
                  onMouseLeave={e=>{ if(!active&&!isChecked)e.currentTarget.style.background=wasPrinted?"#f0fdf4":"#fff"; }}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
                    {batchMode&&(
                      <input type="checkbox" checked={isChecked} onChange={()=>toggleCheck(r.id)}
                        onClick={e=>e.stopPropagation()}
                        style={{width:15,height:15,cursor:"pointer",accentColor:C.accent,marginTop:2,flexShrink:0}}/>
                    )}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                        <span style={{fontWeight:700,fontSize:12,color:C.primary,fontFamily:"monospace"}}>{r.resultNo}</span>
                        <div style={{display:"flex",alignItems:"center",gap:5}}>
                          {wasPrinted&&<span style={{fontSize:9,color:"#16a34a",fontWeight:600}}>🖨</span>}
                          <span style={{fontSize:11,color:C.muted}}>{fmtDate(r.date)}</span>
                        </div>
                      </div>
                      <div style={{fontWeight:600,fontSize:12,color:C.text,marginBottom:4,
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p?.name||"—"}</div>
                      <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
                        {activeTab==="all"&&(
                          <span style={{background:(sec?.color||C.primary)+"18",color:sec?.color||C.primary,
                            padding:"1px 7px",borderRadius:8,fontSize:10,fontWeight:600}}>{r.sectionLabel}</span>
                        )}
                        {flags>0
                          ?<span style={{background:C.redLight,color:C.red,padding:"1px 7px",borderRadius:8,fontSize:10,fontWeight:600}}>⚠ {flags} flag{flags>1?"s":""}</span>
                          :<span style={{background:C.greenLight,color:C.green,padding:"1px 7px",borderRadius:8,fontSize:10}}>✓ Normal</span>}
                        {wasPrinted
                          ?<span style={{background:"#dcfce7",color:"#16a34a",padding:"1px 7px",borderRadius:8,fontSize:9,fontWeight:600}}>Printed</span>
                          :<span style={{background:"#fef3c7",color:"#b45309",padding:"1px 7px",borderRadius:8,fontSize:9,fontWeight:600}}>Not Printed</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Pagination controls */}
          {totalPages>1&&(
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"8px 0",borderTop:`1px solid ${C.border}`,background:C.surface,flexShrink:0}}>
              <button style={{...Btn("ghost",{height:26,fontSize:11,padding:"0 8px"}),opacity:resultPage<=1?0.4:1}}
                disabled={resultPage<=1} onClick={()=>setResultPage(p=>Math.max(1,p-1))}>‹ Prev</button>
              <span style={{fontSize:11,color:C.muted,minWidth:80,textAlign:"center"}}>
                {resultPage} / {totalPages}
              </span>
              <button style={{...Btn("ghost",{height:26,fontSize:11,padding:"0 8px"}),opacity:resultPage>=totalPages?0.4:1}}
                disabled={resultPage>=totalPages} onClick={()=>setResultPage(p=>Math.min(totalPages,p+1))}>Next ›</button>
            </div>
          )}
        </Card>

        {/* Detail Panel */}
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:12,minWidth:0}}>
          {!sel&&(
            <Card>
              <div style={{padding:60,textAlign:"center",color:C.faint}}>
                <div style={{fontSize:40,marginBottom:10}}>📋</div>
                <div style={{fontSize:14,fontWeight:600,color:C.muted,marginBottom:6}}>Select a result</div>
                <div style={{fontSize:12}}>Click any result on the left to view details</div>
              </div>
            </Card>
          )}
          {sel&&(()=>{
            const p=getP(sel.patientId);
            const sec=SECTIONS.find(s=>s.id===sel.section);
            return(
              <>
                <Card>
                  <CardHead title={sel.resultNo} sub={`${sel.sectionLabel} · ${fmtDate(sel.date)}${sel.printed?" · ✅ Printed "+(sel.printedAt?fmtDate(sel.printedAt):""):" · ⏳ Not yet printed"}`}
                    icon={sec?.icon}
                    right={
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        {!editMode&&<button style={Btn("ghost")} onClick={startEdit}>✏ Edit</button>}
                        {!editMode&&<button style={Btn("primary")} onClick={()=>onPrint(sel)}>🖨 Print PDF</button>}
                        {!editMode&&<button style={Btn("danger")} onClick={()=>{if(confirm("Delete this result?")){onDelete(sel.id);setSel(null);}}}>🗑 Delete</button>}
                        {editMode&&<button style={Btn("success")} onClick={saveEdit}>💾 Save</button>}
                        {editMode&&<button style={Btn("ghost")} onClick={cancelEdit}>Cancel</button>}
                      </div>
                    }/>
                  <div style={{padding:"12px 16px",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"8px 16px",background:C.surface,borderBottom:`1px solid ${C.border}`}}>
                    {[
                      ["Patient",p?.name||"—"],["Patient ID",p?.pid||"—"],
                      ["Age / Sex",`${calcAge(p?.dob)} / ${p?.gender||"—"}`],
                    ].map(([l,v])=>(
                      <div key={l}>
                        <div style={{fontSize:10,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",marginBottom:2}}>{l}</div>
                        <div style={{fontSize:12,color:C.text,fontWeight:500}}>{v}</div>
                      </div>
                    ))}
                    <div>
                      <div style={{fontSize:10,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",marginBottom:2}}>Ward</div>
                      {editMode
                        ?<input value={editWard} onChange={e=>setEditWard(e.target.value)} style={inp({width:"100%",height:26,fontSize:11})} placeholder="Ward"/>
                        :<div style={{fontSize:12,color:C.text,fontWeight:500}}>{sel.ward||"—"}</div>}
                    </div>
                    <div>
                      <div style={{fontSize:10,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",marginBottom:2}}>Physician</div>
                      {editMode
                        ?<StaffDrop staff={staff} roles={["Physician"]} value={editPhysician} onChange={setEditPhysician} placeholder="Physician" width={160}/>
                        :<div style={{fontSize:12,color:C.text,fontWeight:500}}>{sel.physician||"—"}</div>}
                    </div>
                    <div>
                      <div style={{fontSize:10,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",marginBottom:2}}>Pathologist</div>
                      {editMode
                        ?<StaffDrop staff={staff} roles={["Pathologist"]} value={editPathologist} onChange={setEditPathologist} placeholder="Pathologist" width={160}/>
                        :<div style={{fontSize:12,color:C.text,fontWeight:500}}>{sel.pathologist||"—"}</div>}
                    </div>
                    <div>
                      <div style={{fontSize:10,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",marginBottom:2}}>Performed By</div>
                      {editMode
                        ?<StaffDrop staff={staff} roles={["Medical Technologist","Med. Technologist"]} value={editMedtech} onChange={setEditMedtech} placeholder="Med. Tech." width={160}/>
                        :<div style={{fontSize:12,color:C.text,fontWeight:500}}>{sel.medtech||"—"}</div>}
                    </div>
                    <div>
                      <div style={{fontSize:10,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",marginBottom:2}}>Validated By</div>
                      {editMode
                        ?<StaffDrop staff={staff} roles={["Medical Technologist","Med. Technologist"]} value={editValidatedBy} onChange={setEditValidatedBy} placeholder="Validator" width={160}/>
                        :<div style={{fontSize:12,color:C.text,fontWeight:500}}>{sel.validatedBy||"—"}</div>}
                    </div>
                  </div>
                </Card>

                <Card>
                  <CardHead title="Test Results"
                    sub={editMode?"Editing — change values and click Save":`${sel.lines?.length||0} tests recorded`}/>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead><tr style={{background:C.surface,borderBottom:`1px solid ${C.border}`}}>
                      {(editMode?["Test","Result","Unit","Normal Range","Flag",""].map(h=>(
                        <th key={h} style={{padding:"8px 14px",textAlign:"left",fontSize:11,
                          fontWeight:700,color:C.primary,textTransform:"uppercase",letterSpacing:".04em"}}>{h}</th>
                      )):["Test","Result","Unit","Normal Range","Flag"].map(h=>(
                        <th key={h} style={{padding:"8px 14px",textAlign:"left",fontSize:11,
                          fontWeight:700,color:C.primary,textTransform:"uppercase",letterSpacing:".04em"}}>{h}</th>
                      )))}
                    </tr></thead>
                    <tbody>
                      {(editMode?editLines:sel.lines)?.map((l,i)=>{
                        const n=parseFloat(l.value);
                        const _rmin=parseFloat(l.normalMin);const _rmax=parseFloat(l.normalMax);const flag=!isNaN(n)?((l.normalMin!==undefined&&l.normalMin!==""&&!isNaN(_rmin)&&n<_rmin)?"LO":(l.normalMax!==undefined&&l.normalMax!==""&&!isNaN(_rmax)&&n>_rmax)?"HI":""):l.flag||"";
                        const flagBg=flag==="HI"?C.redLight:flag==="LO"?"#eff6ff":i%2===0?"#fff":C.surface;
                        const upLine=(u)=>setEditLines(prev=>prev.map((x,j)=>j===i?{...x,...u}:x));
                        return(
                          <tr key={i} style={{borderBottom:`1px solid ${C.border}`,background:flagBg}}>
                            <td style={{padding:editMode?"4px 8px":"9px 14px",fontWeight:500}}>
                              {editMode
                                ?<input value={l.testName||""} onChange={e=>upLine({testName:e.target.value})}
                                    style={inp({width:"100%",minWidth:120,fontWeight:500})} placeholder="Test name"/>
                                :l.testName}
                            </td>
                            <td style={{padding:editMode?"4px 8px":"9px 14px",fontWeight:700,fontSize:13,
                              color:flag==="HI"?C.red:flag==="LO"?"#1a6fb5":C.text}}>
                              {editMode?(
                                <input value={l.value||""} onChange={e=>upLine({value:e.target.value})}
                                  style={inp({width:90,textAlign:"right",fontWeight:600})} placeholder="value"/>
                              ):(l.value||<span style={{color:C.faint,fontStyle:"italic"}}>—</span>)}
                            </td>
                            <td style={{padding:editMode?"4px 8px":"9px 14px",color:C.muted}}>
                              {editMode
                                ?<input value={l.unit||""} onChange={e=>upLine({unit:e.target.value})}
                                    style={inp({width:60})} placeholder="unit"/>
                                :l.unit}
                            </td>
                            <td style={{padding:editMode?"4px 8px":"9px 14px",color:C.green,fontWeight:500}}>
                              {editMode
                                ?<div style={{display:"flex",gap:3,alignItems:"center"}}>
                                    <input value={l.normalMin||""} onChange={e=>upLine({normalMin:e.target.value,normalRange:(e.target.value||"")+(l.normalMax?"-"+l.normalMax:"")})}
                                      style={inp({width:48,textAlign:"center"})} placeholder="min"/>
                                    <span style={{color:C.faint}}>–</span>
                                    <input value={l.normalMax||""} onChange={e=>upLine({normalMax:e.target.value,normalRange:(l.normalMin||"")+"-"+(e.target.value||"")})}
                                      style={inp({width:48,textAlign:"center"})} placeholder="max"/>
                                  </div>
                                :(l.normalRange||"—")}
                            </td>
                            <td style={{padding:editMode?"4px 8px":"9px 14px"}}>
                              {flag
                                ?<span style={{padding:"2px 9px",borderRadius:10,fontSize:11,fontWeight:700,
                                  background:flag==="HI"?C.redLight:flag==="LO"?"#dbeafe":C.greenLight,
                                  color:flag==="HI"?C.red:flag==="LO"?"#1a6fb5":C.green}}>{flag}</span>
                                :<span style={{color:C.faint,fontSize:11}}>—</span>}
                            </td>
                            {editMode&&<td style={{padding:"4px 8px"}}>
                              <button onClick={()=>removeEditLine(i)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:16,fontWeight:700,lineHeight:1}} title="Remove test">×</button>
                            </td>}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {editMode&&(
                    <div style={{padding:"8px 14px",borderTop:`1px dashed ${C.border}`}}>
                      <button onClick={addEditLine}
                        style={{fontSize:12,color:C.accent,background:C.accentLight,border:`1px dashed ${C.accent}`,borderRadius:6,padding:"5px 14px",cursor:"pointer",fontWeight:600}}>
                        + Add Test
                      </button>
                    </div>
                  )}
                </Card>

                {/* Remark display / edit for chem, hema, serology */}
                {(sel.section==="bloodchem"||sel.section==="hematology"||sel.section==="serology")&&(
                  <Card>
                    <div style={{padding:"12px 16px"}}>
                      <div style={{fontSize:11,fontWeight:700,color:C.primary,marginBottom:6}}>
                        📝 Remarks / Impression
                      </div>
                      {editMode
                        ?<textarea value={editRemark} onChange={e=>setEditRemark(e.target.value)}
                            rows={2} placeholder="Type a remark or impression…"
                            style={{width:"100%",padding:"7px 10px",border:`1.5px solid ${C.border}`,borderRadius:6,
                              fontSize:12,fontFamily:"inherit",resize:"vertical",outline:"none",color:C.text,background:"#fff",boxSizing:"border-box"}}/>
                        :<div style={{fontSize:12,color:sel.remark?C.text:C.faint,fontStyle:sel.remark?"normal":"italic",lineHeight:1.6}}>
                          {sel.remark||"No remark recorded."}
                        </div>}
                    </div>
                  </Card>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PATIENTS VIEW
══════════════════════════════════════════════════════ */
function PatientsView({data,onSave}){
  const blank={name:"",dob:"",gender:"Male",address:"",phone:""};
  const [form,setForm]=useState(blank);
  const [search,setSearch]=useState("");
  const [editId,setEditId]=useState(null);
  const [showForm,setShowForm]=useState(false);

  const startEdit=p=>{
    setForm({name:p.name,dob:p.dob||"",gender:p.gender||"Male",address:p.address||"",phone:p.phone||""});
    setEditId(p.id);setShowForm(true);
  };
  const startNew=()=>{ setForm(blank);setEditId(null);setShowForm(true); };

  const handleSave=()=>{
    if(!form.name)return alert("Name required.");
    if(editId){
      onSave(data.map(p=>p.id===editId?{...p,...form}:p));
    } else {
      onSave([...data,{...form,id:uid(),pid:"PT-"+String(data.length+1).padStart(5,"0"),registered:toInputDate()}]);
    }
    setForm(blank);setEditId(null);setShowForm(false);
  };
  const handleDel=id=>{ if(confirm("Delete this patient? This cannot be undone."))onSave(data.filter(p=>p.id!==id)); };

  const filtered=data.filter(p=>!search
    ||p.name.toLowerCase().includes(search.toLowerCase())
    ||p.pid.toLowerCase().includes(search.toLowerCase())
    ||(p.phone||"").includes(search));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontWeight:700,fontSize:18,color:C.text}}>👤 Patient Registry</div>
        <button style={Btn("primary")} onClick={()=>{if(!showForm)startNew();}}>+ Register Patient</button>
      </div>

      {/* Add/Edit Form */}
      {showForm&&(
        <Card>
          <CardHead title={editId?"Edit Patient":"Register New Patient"} icon={editId?"✏":"👤"}/>
          <div style={{padding:16,display:"flex",gap:12,flexWrap:"wrap"}}>
            <Field label="Full Name *" style={{flex:2,minWidth:200}}>
              <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={inp({})} placeholder="Full name" autoFocus/>
            </Field>
            <Field label="Date of Birth" style={{width:140}}>
              <input type="date" value={form.dob} onChange={e=>setForm(p=>({...p,dob:e.target.value}))} style={inp({width:140})}/>
            </Field>
            <Field label="Age" style={{width:60}}>
              <input readOnly value={form.dob?calcAge(form.dob):""} style={inp({width:60,background:"#f5f5f5",fontWeight:600,textAlign:"center"})} placeholder="—"/>
            </Field>
            <Field label="Sex" style={{width:90}}>
              <select value={form.gender} onChange={e=>setForm(p=>({...p,gender:e.target.value}))} style={inp({width:90})}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </Field>
            <Field label="Phone" style={{width:140}}>
              <input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} style={inp({width:140})} placeholder="+63 …"/>
            </Field>
            <Field label="Address" style={{flex:2,minWidth:200}}>
              <input value={form.address} onChange={e=>setForm(p=>({...p,address:e.target.value}))} style={inp({})} placeholder="Address"/>
            </Field>
          </div>
          <div style={{padding:"10px 16px",borderTop:`1px solid ${C.border}`,background:C.surface,
            display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button style={Btn("ghost")} onClick={()=>{setShowForm(false);setEditId(null);setForm(blank);}}>Cancel</button>
            <button style={Btn("primary")} onClick={handleSave}>{editId?"💾 Save Changes":"+ Register"}</button>
          </div>
        </Card>
      )}

      <Card>
        <CardHead title="Patient List" sub={`${filtered.length} of ${data.length} patients`}
          right={
            <input value={search} onChange={e=>setSearch(e.target.value)}
              style={inp({width:240})} placeholder="Search name, ID, phone…"/>
          }/>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:C.surface,borderBottom:`1px solid ${C.border}`}}>
            {["Patient ID","Full Name","DOB","Age","Sex","Phone","Address","Actions"].map(h=>(
              <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:11,fontWeight:700,
                color:C.primary,textTransform:"uppercase",letterSpacing:".04em"}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.length===0&&(
              <tr><td colSpan={8} style={{padding:28,textAlign:"center",color:C.faint,fontSize:12}}>No patients found.</td></tr>
            )}
            {filtered.map((p,i)=>(
              <tr key={p.id} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?"#fff":C.surface}}>
                <td style={{padding:"9px 12px",fontFamily:"monospace",fontSize:11,color:C.primary,fontWeight:700}}>{p.pid}</td>
                <td style={{padding:"9px 12px",fontWeight:600}}>{p.name}</td>
                <td style={{padding:"9px 12px",color:C.muted}}>{p.dob||"—"}</td>
                <td style={{padding:"9px 12px",color:C.muted}}>{calcAge(p.dob)}</td>
                <td style={{padding:"9px 12px"}}>{p.gender}</td>
                <td style={{padding:"9px 12px",color:C.muted}}>{p.phone||"—"}</td>
                <td style={{padding:"9px 12px",color:C.muted,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.address||"—"}</td>
                <td style={{padding:"9px 12px"}}>
                  <div style={{display:"flex",gap:6}}>
                    <button style={Btn("ghost",{fontSize:11,height:26,padding:"0 10px"})} onClick={()=>startEdit(p)}>✏ Edit</button>
                    <button style={Btn("danger",{fontSize:11,height:26,padding:"0 10px"})} onClick={()=>handleDel(p.id)}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PERSONNEL VIEW
══════════════════════════════════════════════════════ */
function PersonnelView({data,onSave}){
  const ROLES=["Physician","Pathologist","Medical Technologist","Lab Aide","Nurse","Admin","Receptionist"];
  const blank={name:"",role:"",licenseNo:"",eSignature:""};
  const [form,setForm]=useState(blank);
  const [filterRole,setFilterRole]=useState("");
  const [showForm,setShowForm]=useState(false);
  const [editId,setEditId]=useState(null);
  const [editForm,setEditForm]=useState({});

  const add=()=>{
    if(!form.name||!form.role)return alert("Name and role are required.");
    onSave([...data,{...form,id:uid(),pid:"PER-"+String(data.length+1).padStart(4,"0")}]);
    setForm(blank);setShowForm(false);
  };

  const startEdit=s=>{setEditId(s.id);setEditForm({name:s.name,role:s.role,licenseNo:s.licenseNo||"",eSignature:s.eSignature||""});};
  const saveEdit=()=>{
    if(!editForm.name||!editForm.role)return alert("Name and role are required.");
    onSave(data.map(s=>s.id===editId?{...s,...editForm}:s));
    setEditId(null);setEditForm({});
  };
  const cancelEdit=()=>{setEditId(null);setEditForm({});};

  const filtered=filterRole?data.filter(s=>s.role===filterRole):data;
  const keyRoles=["Physician","Pathologist","Medical Technologist"];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontWeight:700,fontSize:18,color:C.text}}>👨‍⚕️ Personnel</div>
        <button style={Btn("primary")} onClick={()=>{if(!showForm){setForm(blank);setEditId(null);setShowForm(true);}}}>+ Add Staff</button>
      </div>

      <div style={{background:"#fefce8",border:"1px solid #fde68a",borderRadius:6,
        padding:"8px 14px",fontSize:12,color:"#92400e",display:"flex",alignItems:"center",gap:8}}>
        <span>ℹ</span>
        <span>Staff with roles <b>Physician</b>, <b>Pathologist</b>, and <b>Medical Technologist</b> will appear as dropdown options in result entry forms.</span>
      </div>

      {showForm&&(
        <Card>
          <CardHead title="Add New Staff Member" icon="👨‍⚕️"/>
          <div style={{padding:16,display:"flex",gap:12,flexWrap:"wrap"}}>
            <Field label="Full Name *" style={{flex:2,minWidth:200}}>
              <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={inp({})} placeholder="Full name" autoFocus/>
            </Field>
            <Field label="Role *" style={{width:200}}>
              <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} style={inp({width:200})}>
                <option value=""></option>
                {ROLES.map(r=><option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="License No." style={{width:130}}>
              <input value={form.licenseNo} onChange={e=>setForm(p=>({...p,licenseNo:e.target.value}))} style={inp({width:130})} placeholder="PRC No."/>
            </Field>
            <Field label="E-Signature Image" style={{flex:"100%"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <label style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 12px",
                  background:"#f0f9ff",border:"1px solid #7dd3fc",borderRadius:6,cursor:"pointer",fontSize:12,color:"#0369a1",fontWeight:600}}>
                  📷 Upload Signature
                  <input type="file" accept="image/*" style={{display:"none"}}
                    onChange={e=>{
                      const file=e.target.files?.[0];if(!file)return;
                      if(file.size>2*1024*1024){alert("Max 2MB");return;}
                      const r=new FileReader();
                      r.onload=ev=>setForm(p=>({...p,eSignature:ev.target.result}));
                      r.readAsDataURL(file);e.target.value="";
                    }}/>
                </label>
                {form.eSignature&&(
                  <>
                    <img src={form.eSignature} alt="e-sig preview"
                      style={{height:36,maxWidth:160,objectFit:"contain",border:"1px solid #e2e8f0",borderRadius:4,background:"#fff",padding:2}}/>
                    <button onClick={()=>setForm(p=>({...p,eSignature:""}))}
                      style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:12,fontWeight:700}}>✕ Remove</button>
                  </>
                )}
                {!form.eSignature&&<span style={{fontSize:11,color:C.faint,fontStyle:"italic"}}>No signature uploaded — PNG/JPG with transparent background recommended</span>}
              </div>
            </Field>
          </div>
          <div style={{padding:"10px 16px",borderTop:`1px solid ${C.border}`,background:C.surface,
            display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button style={Btn("ghost")} onClick={()=>setShowForm(false)}>Cancel</button>
            <button style={Btn("primary")} onClick={add}>+ Add Staff</button>
          </div>
        </Card>
      )}

      <Card>
        <CardHead title="Staff Directory" sub={`${filtered.length} of ${data.length} personnel`}
          right={
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:12,color:C.muted}}>Filter:</span>
              <select value={filterRole} onChange={e=>setFilterRole(e.target.value)} style={inp({width:190})}>
                <option value="">All roles</option>
                {ROLES.map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
          }/>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:C.surface,borderBottom:`1px solid ${C.border}`}}>
            {["ID","Name","Role","License No.","E-Signature",""].map(h=>(
              <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:11,fontWeight:700,
                color:C.primary,textTransform:"uppercase",letterSpacing:".04em"}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.length===0&&<tr><td colSpan={6} style={{padding:28,textAlign:"center",color:C.faint,fontSize:12}}>No personnel added.</td></tr>}
            {filtered.map((s,i)=>{
              const isEd=editId===s.id;
              return(
              <tr key={s.id} style={{borderBottom:`1px solid ${C.border}`,background:isEd?C.accentLight:i%2===0?"#fff":C.surface}}>
                {isEd?(
                  <>
                    <td style={{padding:"7px 12px",fontFamily:"monospace",fontSize:11,color:C.muted}}>{s.pid}</td>
                    <td style={{padding:"5px 8px"}}>
                      <input value={editForm.name} onChange={e=>setEditForm(p=>({...p,name:e.target.value}))}
                        style={inp({width:160})} placeholder="Full name" autoFocus/>
                    </td>
                    <td style={{padding:"5px 8px"}}>
                      <select value={editForm.role} onChange={e=>setEditForm(p=>({...p,role:e.target.value}))} style={inp({width:170})}>
                        <option value=""></option>
                        {ROLES.map(r=><option key={r}>{r}</option>)}
                      </select>
                    </td>
                    <td style={{padding:"5px 8px"}}>
                      <input value={editForm.licenseNo} onChange={e=>setEditForm(p=>({...p,licenseNo:e.target.value}))}
                        style={inp({width:110})} placeholder="PRC No."/>
                    </td>
                    <td style={{padding:"5px 8px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <label style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",
                          background:"#f0f9ff",border:"1px solid #7dd3fc",borderRadius:5,cursor:"pointer",fontSize:11,color:"#0369a1",fontWeight:600,whiteSpace:"nowrap"}}>
                          📷 {editForm.eSignature?"Change":"Upload"}
                          <input type="file" accept="image/*" style={{display:"none"}}
                            onChange={e=>{
                              const file=e.target.files?.[0];if(!file)return;
                              if(file.size>2*1024*1024){alert("Max 2MB");return;}
                              const r=new FileReader();
                              r.onload=ev=>setEditForm(p=>({...p,eSignature:ev.target.result}));
                              r.readAsDataURL(file);e.target.value="";
                            }}/>
                        </label>
                        {editForm.eSignature&&(
                          <>
                            <img src={editForm.eSignature} alt="e-sig"
                              style={{height:28,maxWidth:90,objectFit:"contain",border:"1px solid #e2e8f0",borderRadius:3,background:"#fff",padding:1}}/>
                            <button onClick={()=>setEditForm(p=>({...p,eSignature:""}))}
                              style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:13,fontWeight:700,lineHeight:1}}>✕</button>
                          </>
                        )}
                      </div>
                    </td>
                    <td style={{padding:"5px 8px",whiteSpace:"nowrap",display:"flex",gap:4}}>
                      <button style={Btn("success",{fontSize:11,height:26,padding:"0 10px"})} onClick={saveEdit}>✓ Save</button>
                      <button style={Btn("ghost",{fontSize:11,height:26,padding:"0 10px"})} onClick={cancelEdit}>Cancel</button>
                    </td>
                  </>
                ):(
                  <>
                    <td style={{padding:"9px 12px",fontFamily:"monospace",fontSize:11,color:C.muted}}>{s.pid}</td>
                    <td style={{padding:"9px 12px",fontWeight:600}}>{s.name}</td>
                    <td style={{padding:"9px 12px"}}>
                      <span style={{
                        padding:"2px 9px",borderRadius:10,fontSize:11,fontWeight:600,
                        background:keyRoles.includes(s.role)?C.accentLight:"#f0f0f0",
                        color:keyRoles.includes(s.role)?C.accent:C.muted
                      }}>{s.role}</span>
                    </td>
                    <td style={{padding:"9px 12px",color:C.muted}}>{s.licenseNo||"—"}</td>
                    <td style={{padding:"9px 12px"}}>
                      {s.eSignature
                        ?<img src={s.eSignature} alt="e-sig"
                            style={{height:32,maxWidth:110,objectFit:"contain",border:"1px solid #e2e8f0",borderRadius:4,background:"#fff",padding:2}}/>
                        :<span style={{fontSize:11,color:C.faint,fontStyle:"italic"}}>None</span>}
                    </td>
                    <td style={{padding:"9px 12px",whiteSpace:"nowrap",display:"flex",gap:4}}>
                      <button style={Btn("ghost",{fontSize:11,height:26,padding:"0 10px"})} onClick={()=>startEdit(s)}>✏ Edit</button>
                      <button style={Btn("danger",{fontSize:11,height:26,padding:"0 10px"})}
                        onClick={()=>{if(confirm("Remove staff?"))onSave(data.filter(x=>x.id!==s.id));}}>🗑</button>
                    </td>
                  </>
                )}
              </tr>
            );})}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PARAMETERS VIEW
══════════════════════════════════════════════════════ */
function ParametersView({tests,onSave}){
  const [local,setLocal]=useState(()=>JSON.parse(JSON.stringify(tests)));
  const [sec,setSec]=useState("hematology");
  const [editing,setEditing]=useState(null);
  const [newGroup,setNewGroup]=useState("");
  const blank={name:"",unit:"",normalMin:"",normalMax:"",normalText:"",inputType:"text",options:[],brands:[],showBrand:false,showUnit:true,showNormal:true,showFlag:true};
  const [newT,setNewT]=useState(blank);
  const [newTG,setNewTG]=useState("");        // index string OR "__new__"
  const [newOptInput,setNewOptInput]=useState("");   // typed option for Add Test
  const [editOptInput,setEditOptInput]=useState(""); // typed option for inline Edit
  const [newBrandInput,setNewBrandInput]=useState("");   // typed brand for Add Test
  const [editBrandInput,setEditBrandInput]=useState(""); // typed brand for inline Edit
  const [newTGName,setNewTGName]=useState(""); // typed name when creating new group inline
  const [flash,setFlash]=useState(false);
  const groups=local[sec]||[];
  const localRef=useRef(local);
  localRef.current=local;

  // Auto-save when component unmounts (user navigates away)
  useEffect(()=>{
    return()=>{ onSave(localRef.current); };
  },[]);

  const save=()=>{onSave(local);setFlash(true);setTimeout(()=>setFlash(false),2000);};
  const reset=()=>{if(!confirm("Reset to defaults?"))return;setLocal(prev=>{const u={...prev,[sec]:JSON.parse(JSON.stringify(DEFAULT_TESTS[sec]||[]))};onSave(u);return u;});};
  const addGroup=()=>{
    if(!newGroup.trim())return;
    setLocal(prev=>{
      const grps=prev[sec]||[];
      if(grps.find(g=>g.group===newGroup.trim())){alert("Group already exists.");return prev;}
      return {...prev,[sec]:[...grps,{group:newGroup.trim(),tests:[]}]};
    });
    setNewGroup("");
  };
  const delGroup=gi=>{
    if(!confirm("Delete group and all its tests?"))return;
    setLocal(prev=>({...prev,[sec]:(prev[sec]||[]).filter((_,i)=>i!==gi)}));
  };
  const addTest=()=>{
    if(!newT.name.trim())return alert("Test name is required.");
    if(newTG==="")return alert("Please select or create a group first.");
    const t={id:"t_"+uid(),name:newT.name.trim(),unit:newT.unit.trim(),
      normalMin:newT.normalMin!==""&&newT.normalMin!==undefined?String(newT.normalMin).trim():undefined,
      normalMax:newT.normalMax!==""&&newT.normalMax!==undefined?String(newT.normalMax).trim():undefined,
      normalText:newT.normalText.trim(),
      inputType:newT.inputType||"text",
      options:newT.inputType==="dropdown"?(Array.isArray(newT.options)?newT.options:[]):undefined,
      brands:Array.isArray(newT.brands)?newT.brands:[],showBrand:newT.showBrand||false,
      showUnit:newT.showUnit!==false,showNormal:newT.showNormal!==false,showFlag:newT.showFlag!==false};
    if(newTG==="__new__"){
      if(!newTGName.trim())return alert("Please enter a name for the new group.");
      setLocal(prev=>{
        const grps=prev[sec]||[];
        if(grps.find(g=>g.group===newTGName.trim())){
          return {...prev,[sec]:grps.map(g=>g.group===newTGName.trim()?{...g,tests:[...g.tests,t]}:g)};
        }
        return {...prev,[sec]:[...grps,{group:newTGName.trim(),tests:[t]}]};
      });
      setNewTGName("");
    } else {
      const gi=parseInt(newTG,10);
      setLocal(prev=>{
        const grps=prev[sec]||[];
        return {...prev,[sec]:grps.map((g,i)=>i===gi?{...g,tests:[...g.tests,t]}:g)};
      });
    }
    // Reset form fields individually to avoid component remount / input lock
    setNewT(b=>({...blank,inputType:b.inputType})); // keep input type selection
    setNewTG(g=>g); // keep group selection so user can add more to same group
    setNewOptInput("");
    setNewBrandInput("");
  };
  const delTest=(gi,ti)=>{
    setLocal(prev=>({...prev,[sec]:(prev[sec]||[]).map((g,i)=>i===gi?{...g,tests:g.tests.filter((_,j)=>j!==ti)}:g)}));
    setEditing(null);
  };
  const updT=(gi,ti,k,v)=>{
    setLocal(prev=>{
      let parsed=v;
      if(k==="normalMin"||k==="normalMax"){
        if(v===""||v===null||v===undefined){
          parsed=undefined;  // empty = not set
        } else {
          const s=String(v).trim();
          // Accept: "", "0", "0.", "0.1", "0.10", "-1", ".5" etc.
          if(/^-?\d*\.?\d*$/.test(s)){
            parsed=s; // always keep as STRING so React input never jumps
          } else {
            return prev; // reject non-numeric characters, don't update state
          }
        }
      }
      const next={...prev,[sec]:(prev[sec]||[]).map((g,i)=>i===gi?{...g,tests:g.tests.map((t,j)=>j===ti?{...t,[k]:parsed}:t)}:g)};
      return next;
    });
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{fontWeight:700,fontSize:18,color:C.text}}>⚙ Parameter Setup</div>
      <div style={{display:"flex",gap:14}}>
        {/* Section list */}
        <Card style={{width:185,flexShrink:0}}>
          <CardHead title="Sections"/>
          {SECTIONS.map(s=>(
            <div key={s.id} onClick={()=>{setSec(s.id);setEditing(null);setNewTG("");setNewTGName("");}}
              style={{padding:"9px 14px",cursor:"pointer",borderBottom:`1px solid ${C.border}`,
                background:sec===s.id?C.accentLight:"#fff",
                borderLeft:sec===s.id?`3px solid ${C.accent}`:"3px solid transparent",
                display:"flex",alignItems:"center",gap:8,fontSize:12.5,
                color:sec===s.id?C.accent:C.text,fontWeight:sec===s.id?700:400,
                transition:"all .12s"}}>
              <span style={{fontSize:14}}>{s.icon}</span><span>{s.label}</span>
            </div>
          ))}
        </Card>

        {/* Editor */}
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontWeight:600,fontSize:14,color:C.text}}>
              {SECTIONS.find(s=>s.id===sec)?.icon} {SECTIONS.find(s=>s.id===sec)?.label}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button style={Btn("ghost",{fontSize:12})} onClick={reset}>↺ Reset Defaults</button>
              <button style={Btn(flash?"success":"primary",{fontSize:12})} onClick={save}>{flash?"✓ Saved!":"💾 Save Changes"}</button>
            </div>
          </div>

          {/* Add group */}
          <Card>
            <div style={{padding:"10px 14px",display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:12,color:C.muted,whiteSpace:"nowrap"}}>New Group:</span>
              <input value={newGroup} onChange={e=>setNewGroup(e.target.value)} style={inp({flex:1})} placeholder="Group name…"/>
              <button style={Btn("ghost",{fontSize:12})} onClick={addGroup}>+ Add Group</button>
            </div>
          </Card>

          {/* Add test */}
          <Card>
            <CardHead title="Add New Test" icon="➕"/>
            <div style={{padding:12,display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
              <Field label="Group" style={{width:newTG==="__new__"?130:160}}>
                <select value={newTG} onChange={e=>{setNewTG(e.target.value);if(e.target.value!=="__new__")setNewTGName("");}} style={inp({width:newTG==="__new__"?130:160})}>
                  <option value="">— select —</option>
                  {groups.map((g,i)=><option key={i} value={i}>{g.group}</option>)}
                  <option value="__new__">＋ New group…</option>
                </select>
              </Field>
              {newTG==="__new__"&&(
                <Field label="New Group Name" style={{width:160}}>
                  <input value={newTGName} onChange={e=>setNewTGName(e.target.value)} style={inp({width:160})} placeholder="Group name…" autoFocus/>
                </Field>
              )}
              {[["Test Name","name",160],["Unit","unit",65],["Normal Min","normalMin",80],["Normal Max","normalMax",80],["Normal Text","normalText",120]].map(([l,k,w])=>(
                <Field key={k} label={l} style={{width:w}}>
                  <input value={newT[k]} onChange={e=>setNewT(p=>({...p,[k]:e.target.value}))} style={inp({width:w})} placeholder={l}/>
                </Field>
              ))}
              <Field label="Input Type" style={{width:110}}>
                <select value={newT.inputType} onChange={e=>setNewT(p=>({...p,inputType:e.target.value,options:[]}))} style={inp({width:110})}>
                  <option value="text">✏ Manual</option>
                  <option value="dropdown">▾ Dropdown</option>
                </select>
              </Field>
              {newT.inputType==="dropdown"&&(
                <Field label="Dropdown Options" style={{minWidth:260,flex:1}}>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,padding:"4px 6px",
                    border:`1.5px solid ${C.border}`,borderRadius:6,background:"#fff",minHeight:32,alignItems:"center"}}>
                    {(Array.isArray(newT.options)?newT.options:[]).map((o,i)=>(
                      <span key={i} style={{display:"inline-flex",alignItems:"center",gap:3,
                        background:C.accentLight,color:C.accent,borderRadius:10,
                        padding:"2px 8px",fontSize:11,fontWeight:600}}>
                        {o}
                        <span onClick={()=>setNewT(p=>({...p,options:p.options.filter((_,j)=>j!==i)}))}
                          style={{cursor:"pointer",fontSize:10,opacity:.7,marginLeft:2}}>✕</span>
                      </span>
                    ))}
                    <input value={newOptInput}
                      onChange={e=>setNewOptInput(e.target.value)}
                      onKeyDown={e=>{if((e.key==="Enter"||e.key===",")&&newOptInput.trim()){e.preventDefault();setNewT(p=>({...p,options:[...(p.options||[]),newOptInput.trim()]}));setNewOptInput("");}}}
                      style={{border:"none",outline:"none",fontSize:12,minWidth:80,flex:1,padding:"1px 2px"}}
                      placeholder={newT.options?.length?"add more…":"Type option + Enter"}/>
                  </div>
                </Field>
              )}
              <Field label="Brands" style={{minWidth:200,flex:1}}>
                <div style={{display:"flex",flexWrap:"wrap",gap:4,padding:"4px 6px",
                  border:`1.5px solid ${C.border}`,borderRadius:6,background:"#fff",minHeight:32,alignItems:"center"}}>
                  {(Array.isArray(newT.brands)?newT.brands:[]).map((b,i)=>(
                    <span key={i} style={{display:"inline-flex",alignItems:"center",gap:3,
                      background:"#fff3e0",color:"#b85c00",borderRadius:10,
                      padding:"2px 8px",fontSize:11,fontWeight:600}}>
                      {b}
                      <span onClick={()=>setNewT(p=>({...p,brands:p.brands.filter((_,j)=>j!==i)}))}
                        style={{cursor:"pointer",fontSize:10,opacity:.7,marginLeft:2}}>✕</span>
                    </span>
                  ))}
                  <input value={newBrandInput}
                    onChange={e=>setNewBrandInput(e.target.value)}
                    onKeyDown={e=>{if((e.key==="Enter"||e.key===",")&&newBrandInput.trim()){e.preventDefault();setNewT(p=>({...p,brands:[...(p.brands||[]),newBrandInput.trim()]}));setNewBrandInput("");}}}
                    style={{border:"none",outline:"none",fontSize:12,minWidth:80,flex:1,padding:"1px 2px"}}
                    placeholder={(newT.brands||[]).length?"add brand…":"e.g. Sysmex + Enter"}/>
                </div>
              </Field>
              <Field label="Show Brand" style={{width:80,alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,height:32}}>
                  <input type="checkbox" checked={newT.showBrand} onChange={e=>setNewT(p=>({...p,showBrand:e.target.checked}))}
                    style={{width:15,height:15,cursor:"pointer",accentColor:C.accent}}/>
                  <span style={{fontSize:11,color:C.muted}}>Print</span>
                </div>
              </Field>
              <Field label="Show Unit" style={{width:80,alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,height:32}}>
                  <input type="checkbox" checked={newT.showUnit!==false} onChange={e=>setNewT(p=>({...p,showUnit:e.target.checked}))}
                    style={{width:15,height:15,cursor:"pointer",accentColor:C.accent}}/>
                  <span style={{fontSize:11,color:C.muted}}>PDF</span>
                </div>
              </Field>
              <Field label="Show Normal" style={{width:90,alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,height:32}}>
                  <input type="checkbox" checked={newT.showNormal!==false} onChange={e=>setNewT(p=>({...p,showNormal:e.target.checked}))}
                    style={{width:15,height:15,cursor:"pointer",accentColor:C.accent}}/>
                  <span style={{fontSize:11,color:C.muted}}>PDF</span>
                </div>
              </Field>
              <Field label="Show Flag" style={{width:80,alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,height:32}}>
                  <input type="checkbox" checked={newT.showFlag!==false} onChange={e=>setNewT(p=>({...p,showFlag:e.target.checked}))}
                    style={{width:15,height:15,cursor:"pointer",accentColor:C.accent}}/>
                  <span style={{fontSize:11,color:C.muted}}>PDF</span>
                </div>
              </Field>
              <button style={Btn("primary",{alignSelf:"flex-end",fontSize:12})} onClick={()=>{if(newOptInput.trim()){setNewT(p=>({...p,options:[...(p.options||[]),newOptInput.trim()]}));setNewOptInput("");}else addTest();}}>+ Add</button>
            </div>
          </Card>

          {/* Groups */}
          {groups.map((grp,gi)=>(
            <Card key={gi}>
              <div style={{padding:"8px 14px",borderBottom:`1px solid ${C.border}`,
                display:"flex",justifyContent:"space-between",alignItems:"center",background:C.surface}}>
                <input value={grp.group} onChange={e=>{
                  const newName=e.target.value;
                  setLocal(prev=>({...prev,[sec]:(prev[sec]||[]).map((g,i)=>i===gi?{...g,group:newName}:g)}));
                }}
                  style={{fontWeight:700,fontSize:13,color:C.primary,background:"transparent",border:"none",borderBottom:`1px dashed ${C.accent}`,outline:"none",padding:"2px 4px",flex:1,marginRight:8,fontFamily:"inherit",cursor:"text"}}
                  placeholder="Group name…"/>
                <button style={Btn("danger",{fontSize:11,height:24,padding:"0 10px"})} onClick={()=>delGroup(gi)}>✕ Delete Group</button>
              </div>
              {grp.tests.length===0&&<div style={{padding:"10px 14px",color:C.faint,fontSize:12,fontStyle:"italic"}}>No tests. Add above.</div>}
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                {grp.tests.length>0&&(
                  <thead><tr style={{background:C.surface,borderBottom:`1px solid ${C.border}`}}>
                    {["Test Name","Unit","Normal Min","Normal Max","Normal Text","Input Type","Brand",""].map(h=>(
                      <th key={h} style={{padding:"6px 12px",textAlign:"left",fontSize:11,fontWeight:600,
                        color:C.muted,textTransform:"uppercase",letterSpacing:".04em"}}>{h}</th>
                    ))}
                  </tr></thead>
                )}
                <tbody>
                  {grp.tests.map((t,ti)=>{
                    const isEd=editing?.gi===gi&&editing?.ti===ti;
                    return(
                      <tr key={t.id||ti} style={{borderBottom:`1px solid ${C.border}`,background:ti%2===0?"#fff":C.surface}}>
                        {isEd?(
                          <>
                            {[["name",140],["unit",55],["normalMin",70],["normalMax",70],["normalText",110]].map(([k,w])=>(
                              <td key={k} style={{padding:"5px 6px"}}>
                                <input
                                  value={t[k]!==undefined&&t[k]!==null?String(t[k]):''}
                                  onChange={e=>{
                                    const v=e.target.value;
                                    // For numeric fields allow decimal in-progress (e.g. "0.", "1.0")
                                    if((k==="normalMin"||k==="normalMax")){
                                      // Store raw string so user can type decimals freely
                                      updT(gi,ti,k,v);
                                    } else {
                                      updT(gi,ti,k,v);
                                    }
                                  }}
                                  style={inp({width:w})}
                                  placeholder={k==="normalMin"?"e.g. 0.5":k==="normalMax"?"e.g. 10.5":""}
                                />
                              </td>
                            ))}
                            <td style={{padding:"5px 6px"}}>
                              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                                <select value={t.inputType||"text"} onChange={e=>{updT(gi,ti,"inputType",e.target.value);if(e.target.value==="text")updT(gi,ti,"options",undefined);}} style={inp({width:110,fontSize:11})}>
                                  <option value="text">✏ Manual</option>
                                  <option value="dropdown">▾ Dropdown</option>
                                </select>
                                {(t.inputType==="dropdown")&&(
                                  <div style={{marginTop:4,border:`1.5px solid ${C.border}`,borderRadius:6,
                                    background:"#fff",padding:"3px 5px",minHeight:28,display:"flex",flexWrap:"wrap",gap:3,alignItems:"center"}}>
                                    {(Array.isArray(t.options)?t.options:[]).map((o,oi)=>(
                                      <span key={oi} style={{display:"inline-flex",alignItems:"center",gap:2,
                                        background:C.accentLight,color:C.accent,borderRadius:10,
                                        padding:"1px 7px",fontSize:10,fontWeight:600}}>
                                        {o}
                                        <span onClick={()=>updT(gi,ti,"options",(t.options||[]).filter((_,j)=>j!==oi))}
                                          style={{cursor:"pointer",fontSize:9,opacity:.7}}>✕</span>
                                      </span>
                                    ))}
                                    <input value={editOptInput}
                                      onChange={e=>setEditOptInput(e.target.value)}
                                      onKeyDown={e=>{if((e.key==="Enter"||e.key===",")&&editOptInput.trim()){e.preventDefault();updT(gi,ti,"options",[...(t.options||[]),editOptInput.trim()]);setEditOptInput("");}}}
                                      style={{border:"none",outline:"none",fontSize:11,minWidth:60,flex:1}}
                                      placeholder="add option + Enter"/>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td style={{padding:"5px 6px"}}>
                              <div style={{border:`1.5px solid ${C.border}`,borderRadius:6,background:"#fff",
                                padding:"3px 5px",minHeight:28,display:"flex",flexWrap:"wrap",gap:3,alignItems:"center",marginBottom:4}}>
                                {(Array.isArray(t.brands)?t.brands:[]).map((b,bi)=>(
                                  <span key={bi} style={{display:"inline-flex",alignItems:"center",gap:2,
                                    background:"#fff3e0",color:"#b85c00",borderRadius:10,
                                    padding:"1px 7px",fontSize:10,fontWeight:600}}>
                                    {b}
                                    <span onClick={()=>updT(gi,ti,"brands",(t.brands||[]).filter((_,j)=>j!==bi))}
                                      style={{cursor:"pointer",fontSize:9,opacity:.7}}>✕</span>
                                  </span>
                                ))}
                                <input value={editBrandInput}
                                  onChange={e=>setEditBrandInput(e.target.value)}
                                  onKeyDown={e=>{if((e.key==="Enter"||e.key===",")&&editBrandInput.trim()){e.preventDefault();updT(gi,ti,"brands",[...(t.brands||[]),editBrandInput.trim()]);setEditBrandInput("");}}}
                                  style={{border:"none",outline:"none",fontSize:11,minWidth:55,flex:1}}
                                  placeholder="add brand + Enter"/>
                              </div>
                              <div style={{display:"flex",alignItems:"center",gap:4}}>
                                <input type="checkbox" checked={!!t.showBrand} onChange={e=>updT(gi,ti,"showBrand",e.target.checked)} style={{width:13,height:13,cursor:"pointer",accentColor:C.accent}}/>
                                <span style={{fontSize:10,color:C.muted}}>Print brand</span>
                              </div>
                              <div style={{display:"flex",gap:10,marginTop:4}}>
                                <label style={{display:"flex",alignItems:"center",gap:3,fontSize:10,color:C.muted,cursor:"pointer"}}>
                                  <input type="checkbox" checked={t.showUnit!==false} onChange={e=>updT(gi,ti,"showUnit",e.target.checked)} style={{width:12,height:12,cursor:"pointer",accentColor:C.accent}}/>
                                  Unit
                                </label>
                                <label style={{display:"flex",alignItems:"center",gap:3,fontSize:10,color:C.muted,cursor:"pointer"}}>
                                  <input type="checkbox" checked={t.showNormal!==false} onChange={e=>updT(gi,ti,"showNormal",e.target.checked)} style={{width:12,height:12,cursor:"pointer",accentColor:C.accent}}/>
                                  Normal
                                </label>
                                <label style={{display:"flex",alignItems:"center",gap:3,fontSize:10,color:C.muted,cursor:"pointer"}}>
                                  <input type="checkbox" checked={t.showFlag!==false} onChange={e=>updT(gi,ti,"showFlag",e.target.checked)} style={{width:12,height:12,cursor:"pointer",accentColor:C.accent}}/>
                                  Flag
                                </label>
                              </div>
                            </td>
                            <td style={{padding:"5px 6px",whiteSpace:"nowrap"}}>
                              <button style={Btn("success",{fontSize:11,height:26,padding:"0 10px"})} onClick={()=>{setEditing(null);setEditOptInput("");setEditBrandInput("");}}>✓ Done</button>
                            </td>
                          </>
                        ):(
                          <>
                            <td style={{padding:"8px 12px",fontWeight:500}}>{t.name}</td>
                            <td style={{padding:"8px 12px",color:C.muted}}>{t.unit||"—"}</td>
                            <td style={{padding:"8px 12px",color:C.muted}}>{t.normalMin??""}</td>
                            <td style={{padding:"8px 12px",color:C.muted}}>{t.normalMax??""}</td>
                            <td style={{padding:"8px 12px",color:C.green,fontWeight:600}}>{t.normalText||"—"}</td>
                            <td style={{padding:"8px 12px"}}>
                              <span style={{fontSize:11,padding:"2px 8px",borderRadius:10,fontWeight:600,
                                background:t.inputType==="dropdown"?C.accentLight:"#f0f0f0",
                                color:t.inputType==="dropdown"?C.accent:C.muted}}>
                                {t.inputType==="dropdown"?"▾ Dropdown":"✏ Manual"}
                              </span>
                              {t.inputType==="dropdown"&&t.options?.length>0&&(
                                <div style={{fontSize:10,color:C.faint,marginTop:2}}>{t.options.join(", ")}</div>
                              )}
                            </td>
                            <td style={{padding:"8px 12px"}}>
                              {(t.brands&&t.brands.length>0)
                                ?<div style={{display:"flex",flexWrap:"wrap",gap:3,alignItems:"center"}}>
                                  {t.brands.map((b,bi)=>(
                                    <span key={bi} style={{fontSize:10,background:"#fff3e0",color:"#b85c00",borderRadius:8,padding:"1px 6px",fontWeight:600}}>{b}</span>
                                  ))}
                                  {t.showBrand&&<span style={{fontSize:10,background:C.greenLight,color:C.green,borderRadius:8,padding:"1px 6px",fontWeight:600}}>print</span>}
                                </div>
                                :<span style={{fontSize:11,color:C.faint,fontStyle:"italic"}}>—</span>}
                              <div style={{display:"flex",gap:4,marginTop:3,flexWrap:"wrap"}}>
                                {[["Unit",t.showUnit!==false],["Normal",t.showNormal!==false],["Flag",t.showFlag!==false]].map(([lbl,on])=>(
                                  <span key={lbl} style={{fontSize:9,borderRadius:6,padding:"1px 5px",fontWeight:600,
                                    background:on?C.greenLight:"#fdecea",color:on?C.green:"#c0392b"}}>
                                    {on?"✓":"✗"} {lbl}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td style={{padding:"8px 8px",whiteSpace:"nowrap"}}>
                              <button style={Btn("ghost",{fontSize:11,height:26,padding:"0 10px"})} onClick={()=>{setEditing({gi,ti});setEditOptInput("");setEditBrandInput("");}}>✏ Edit</button>
                              {" "}
                              <button style={Btn("danger",{fontSize:11,height:26,padding:"0 10px"})} onClick={()=>delTest(gi,ti)}>✕</button>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   HOSPITAL VIEW
══════════════════════════════════════════════════════ */
function HospitalView({data,onSave}){
  const [form,setForm]=useState(data);
  const [saved,setSaved]=useState(false);
  const [logoPreview,setLogoPreview]=useState(data.logoUri||null);
  const [pdfFolder,setPdfFolder]=useState("");
  const [folderSaved,setFolderSaved]=useState(false);
  const [printers,setPrinters]=useState([]);
  const [printerPrefs,setPrinterPrefs]=useState({resultPrinter:"",labelPrinter:""});
  const [printerSaved,setPrinterSaved]=useState(false);
  const save=()=>{onSave(form);setSaved(true);setTimeout(()=>setSaved(false),2000);};

  // Load current PDF folder and printers on mount
  useEffect(()=>{
    if(window.electronAPI?.getPDFFolder){
      window.electronAPI.getPDFFolder().then(f=>setPdfFolder(f||""));
    }
    if(window.electronAPI?.getPrinters){
      window.electronAPI.getPrinters().then(p=>setPrinters(p||[]));
    }
    if(window.electronAPI?.getPrinterPrefs){
      window.electronAPI.getPrinterPrefs().then(p=>setPrinterPrefs(p||{resultPrinter:"",labelPrinter:""}));
    }
  },[]);

  const pickSaveFolder=async()=>{
    if(!window.electronAPI?.pickFolder)return alert("Folder picker not available in browser mode.");
    const r=await window.electronAPI.pickFolder();
    if(r.canceled)return;
    const res=await window.electronAPI.setPDFFolder(r.path);
    if(res.success){setPdfFolder(res.path);setFolderSaved(true);setTimeout(()=>setFolderSaved(false),2000);}
  };

  const resetFolder=async()=>{
    if(!window.electronAPI?.setPDFFolder)return;
    const res=await window.electronAPI.setPDFFolder(null);
    if(res.success){setPdfFolder(res.path);setFolderSaved(true);setTimeout(()=>setFolderSaved(false),2000);}
  };

  const openFolder=()=>{
    if(window.electronAPI?.openFolder) window.electronAPI.openFolder(pdfFolder);
  };

  const handleLogoUpload=(e)=>{
    const file=e.target.files[0];
    if(!file)return;
    if(!file.type.startsWith("image/")){alert("Please select an image file.");return;}
    if(file.size>5*1024*1024){alert("Image too large. Max 5MB.");return;}
    const reader=new FileReader();
    reader.onload=(ev)=>{
      const uri=ev.target.result;
      setLogoPreview(uri);
      setForm(p=>({...p,logoUri:uri}));
    };
    reader.readAsDataURL(file);
  };

  const removeLogo=()=>{
    setLogoPreview(null);
    setForm(p=>({...p,logoUri:"",showLogoInPDF:false}));
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{fontWeight:700,fontSize:18,color:C.text}}>🏥 Hospital Information</div>
      <Card style={{maxWidth:520}}>
        <CardHead title="Edit Hospital Details"/>
        <div style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
          {[["Hospital Name","name"],["Address","address"],["Phone","phone"],["Email","email"],["License No.","licenseNo"]].map(([l,k])=>(
            <Field key={k} label={l}>
              <input value={form[k]||""} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} style={inp({})}/>
            </Field>
          ))}

          {/* ── Logo Upload ── */}
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12,marginTop:2}}>
            <div style={{fontSize:11,fontWeight:700,color:C.faint,letterSpacing:".06em",
              textTransform:"uppercase",marginBottom:8}}>Institution Logo (Optional)</div>

            {logoPreview?(
              <div style={{display:"flex",alignItems:"center",gap:12,
                background:C.surface,borderRadius:8,padding:10,border:`1px solid ${C.border}`}}>
                <img src={logoPreview} alt="Logo"
                  style={{width:64,height:64,objectFit:"contain",borderRadius:6,
                    border:`1px solid ${C.border}`,background:"#fff",padding:4}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:4}}>Logo uploaded ✓</div>
                  <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",userSelect:"none",marginBottom:4}}>
                    <input type="checkbox"
                      checked={!!form.showLogoInPDF}
                      onChange={e=>setForm(p=>({...p,showLogoInPDF:e.target.checked}))}
                      style={{width:15,height:15,accentColor:C.accent,cursor:"pointer"}}/>
                    <span style={{fontSize:12,color:C.text,fontWeight:500}}>Show logo in PDF results</span>
                  </label>
                  {form.showLogoInPDF&&(
                    <div style={{fontSize:11,color:C.muted,background:"#eff6ff",borderRadius:6,
                      padding:"4px 8px",border:"1px solid #bfdbfe"}}>
                      💡 Logo appears above the hospital name and as a faint watermark behind results
                    </div>
                  )}
                </div>
                <button style={Btn("danger",{fontSize:11,height:28,padding:"0 10px"})}
                  onClick={removeLogo}>🗑</button>
              </div>
            ):(
              <div style={{background:C.surface,borderRadius:8,padding:14,
                border:`2px dashed ${C.border}`,textAlign:"center"}}>
                <div style={{fontSize:26,marginBottom:6}}>🖼</div>
                <div style={{fontSize:12,color:C.muted,marginBottom:10}}>
                  Upload your institution's logo (PNG, JPG)<br/>
                  <span style={{fontSize:11,color:C.faint}}>Max 5MB</span>
                </div>
                <label style={{...Btn("ghost",{fontSize:12,height:30,padding:"0 14px"}),
                  cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}>
                  📁 Choose Logo
                  <input type="file" accept="image/*" onChange={handleLogoUpload} style={{display:"none"}}/>
                </label>
              </div>
            )}
          </div>

          {/* ── PDF Save Location ── */}
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12,marginTop:2}}>
            <div style={{fontSize:11,fontWeight:700,color:C.faint,letterSpacing:".06em",
              textTransform:"uppercase",marginBottom:8}}>PDF Save Location</div>
            <div style={{background:C.surface,borderRadius:8,padding:12,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:11,color:C.muted,marginBottom:6}}>All printed PDF results will be saved to:</div>
              <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:6,padding:"6px 10px",
                fontSize:11,fontFamily:"monospace",color:C.text,wordBreak:"break-all",marginBottom:8,
                minHeight:20}}>
                {pdfFolder||"(loading...)"}
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <button onClick={pickSaveFolder} style={{...Btn("accent",{fontSize:11,height:28,padding:"0 12px"})}}>
                  📁 Choose Folder
                </button>
                <button onClick={openFolder} style={{...Btn("ghost",{fontSize:11,height:28,padding:"0 12px"})}}>
                  📂 Open Folder
                </button>
                <button onClick={resetFolder} style={{...Btn("ghost",{fontSize:11,height:28,padding:"0 12px",color:C.muted})}}>
                  ↩ Reset Default
                </button>
                {folderSaved&&<span style={{fontSize:11,color:C.green,fontWeight:600,display:"flex",alignItems:"center"}}>✓ Saved!</span>}
              </div>
              <div style={{fontSize:10,color:C.faint,marginTop:6}}>
                💡 Select a drive/folder (e.g. D:\MedLIMS Results) to save all PDF results there permanently.
              </div>
            </div>
          </div>

          {/* ── Printer Selection ── */}
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12,marginTop:2}}>
            <div style={{fontSize:11,fontWeight:700,color:C.faint,letterSpacing:".06em",
              textTransform:"uppercase",marginBottom:8}}>Printer Settings</div>
            <div style={{background:C.surface,borderRadius:8,padding:12,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:11,color:C.muted,marginBottom:10}}>
                Assign different printers for results and barcode labels.
                {printers.length===0&&<span style={{color:C.amber,fontWeight:600}}> No printers detected — connect a printer and restart the app.</span>}
              </div>

              {/* Result Printer */}
              <div style={{marginBottom:10}}>
                <div style={{fontSize:10,fontWeight:700,color:C.text,marginBottom:3}}>🖨 Result Printer <span style={{fontWeight:400,color:C.faint}}>(for PDF reports)</span></div>
                <select value={printerPrefs.resultPrinter||""} onChange={e=>{
                  const np={...printerPrefs,resultPrinter:e.target.value};
                  setPrinterPrefs(np);
                  if(window.electronAPI?.setPrinterPrefs)window.electronAPI.setPrinterPrefs(np);
                  setPrinterSaved(true);setTimeout(()=>setPrinterSaved(false),2000);
                }} style={inp({width:"100%",fontSize:11})}>
                  <option value="">— System Default —</option>
                  {printers.map(p=><option key={p.name} value={p.name}>{p.displayName}{p.isDefault?" ⭐":""}</option>)}
                </select>
              </div>

              {/* Label / Thermal Printer */}
              <div style={{marginBottom:8}}>
                <div style={{fontSize:10,fontWeight:700,color:C.text,marginBottom:3}}>🏷 Label / Thermal Printer <span style={{fontWeight:400,color:C.faint}}>(for barcode labels)</span></div>
                <select value={printerPrefs.labelPrinter||""} onChange={e=>{
                  const np={...printerPrefs,labelPrinter:e.target.value};
                  setPrinterPrefs(np);
                  if(window.electronAPI?.setPrinterPrefs)window.electronAPI.setPrinterPrefs(np);
                  setPrinterSaved(true);setTimeout(()=>setPrinterSaved(false),2000);
                }} style={inp({width:"100%",fontSize:11})}>
                  <option value="">— System Default —</option>
                  {printers.map(p=><option key={p.name} value={p.name}>{p.displayName}{p.isDefault?" ⭐":""}</option>)}
                </select>
              </div>

              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <button onClick={()=>{
                  if(window.electronAPI?.getPrinters)window.electronAPI.getPrinters().then(p=>setPrinters(p||[]));
                }} style={{...Btn("ghost",{fontSize:11,height:28,padding:"0 12px"})}}>
                  🔄 Refresh Printers
                </button>
                {printerSaved&&<span style={{fontSize:11,color:C.green,fontWeight:600}}>✓ Saved!</span>}
              </div>
              <div style={{fontSize:10,color:C.faint,marginTop:6}}>
                💡 Select your thermal/label printer for barcodes and your regular printer for result PDFs. Changes apply immediately.
              </div>
            </div>
          </div>
        </div>
        <div style={{padding:"10px 16px",borderTop:`1px solid ${C.border}`,background:C.surface,
          display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button style={Btn(saved?"success":"primary")} onClick={save}>{saved?"✓ Saved!":"💾 Save"}</button>
        </div>
      </Card>
    </div>
  );
}


/* ══════════════════════════════════════════════════════
   WELCOME / SETUP PAGE
══════════════════════════════════════════════════════ */
function WelcomePage({hospital,onSave}){
  const [form,setForm]=useState({
    name:hospital.name||"",
    address:hospital.address||"",
    phone:hospital.phone||"",
  });
  const [error,setError]=useState("");

  const handleSave=()=>{
    if(!form.name.trim()){setError("Please enter your laboratory or institution name.");return;}
    onSave(form);
  };

  return(
    <div style={{minHeight:"100vh",
      background:"linear-gradient(160deg,#1a0000 0%,#6b0000 50%,#1a0000 100%)",
      display:"flex",alignItems:"center",justifyContent:"center",
      fontFamily:"'Segoe UI',system-ui,sans-serif",position:"relative",overflow:"hidden"}}>

      {/* Decorative circles */}
      <div style={{position:"absolute",top:-80,right:-80,width:320,height:320,
        borderRadius:"50%",background:"rgba(200,0,0,0.12)"}}/>
      <div style={{position:"absolute",bottom:-60,left:-60,width:240,height:240,
        borderRadius:"50%",background:"rgba(200,0,0,0.10)"}}/>
      <div style={{position:"absolute",top:"30%",left:-40,width:160,height:160,
        borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>

      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:500,padding:24}}>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:80,height:80,borderRadius:20,
            background:"rgba(255,255,255,0.12)",border:"2px solid rgba(255,255,255,0.25)",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:38,margin:"0 auto 16px"}}>🏥</div>
          <div style={{color:"#fff",fontSize:26,fontWeight:800,letterSpacing:".02em",marginBottom:6}}>
            Welcome to MedLIMS
          </div>
          <div style={{color:"rgba(255,255,255,0.65)",fontSize:13,lineHeight:1.6}}>
            Let's set up your laboratory before you begin.<br/>
            You can update this anytime in Hospital Info settings.
          </div>
        </div>

        {/* Form card */}
        <div style={{background:"rgba(255,255,255,0.97)",borderRadius:18,
          boxShadow:"0 30px 80px rgba(0,0,0,.5)",overflow:"hidden"}}>

          <div style={{background:"linear-gradient(135deg,#c0392b,#8b0000)",
            padding:"16px 28px"}}>
            <div style={{color:"#fff",fontWeight:700,fontSize:15,letterSpacing:.3}}>
              🏷 Laboratory / Institution Setup
            </div>
            <div style={{color:"rgba(255,255,255,.7)",fontSize:11,marginTop:3}}>
              This appears on your PDF reports and login screen
            </div>
          </div>

          <div style={{padding:"28px 28px 24px",display:"flex",flexDirection:"column",gap:18}}>

            {error&&(
              <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,
                padding:"10px 14px",fontSize:12,color:"#dc2626",display:"flex",gap:8,alignItems:"center"}}>
                <span>⚠</span><span>{error}</span>
              </div>
            )}

            <Field label="Laboratory / Institution Name *">
              <input value={form.name}
                onChange={e=>{setForm(p=>({...p,name:e.target.value}));setError("");}}
                onKeyDown={e=>e.key==="Enter"&&handleSave()}
                style={inp({width:"100%",fontSize:14,fontWeight:600})}
                placeholder="e.g. Bais District Hospital Clinical Laboratory"
                autoFocus/>
            </Field>

            <Field label="Address (optional)">
              <input value={form.address}
                onChange={e=>setForm(p=>({...p,address:e.target.value}))}
                style={inp({width:"100%"})}
                placeholder="e.g. Bais City, Negros Oriental"/>
            </Field>

            <Field label="Telephone / Contact (optional)">
              <input value={form.phone}
                onChange={e=>setForm(p=>({...p,phone:e.target.value}))}
                style={inp({width:"100%"})}
                placeholder="e.g. (035) 402-0000"/>
            </Field>

            <button onClick={handleSave}
              style={{...Btn("primary"),width:"100%",height:44,fontSize:15,
                justifyContent:"center",fontWeight:700,marginTop:4,
                background:"linear-gradient(135deg,#c0392b,#8b0000)",
                boxShadow:"0 4px 16px rgba(192,57,43,0.4)"}}>
              Get Started →
            </button>
          </div>
        </div>

        <div style={{textAlign:"center",marginTop:20,fontSize:10,color:"rgba(255,255,255,.3)"}}>
          Laboratory Information Management System v1.0 · Created by Bryce Men Kenk C. Ablir, RMT
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════════════════════ */
function LoginPage({accounts,onLogin,hospital}){
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [showPw,setShowPw]=useState(false);
  const [error,setError]=useState("");
  const [shaking,setShaking]=useState(false);

  const shake=()=>{setShaking(true);setTimeout(()=>setShaking(false),500);};

  const handleLogin=()=>{
    if(!username.trim()||!password.trim()){setError("Please enter both username and password.");shake();return;}
    const match=accounts.find(a=>a.username.toLowerCase()===username.trim().toLowerCase()&&a.password===password);
    if(!match){setError("Invalid username or password.");shake();return;}
    setError("");
    onLogin(match);
  };

  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,#1a3a5c 0%,#2d6099 50%,#1a3a5c 100%)`,
      display:"flex",alignItems:"center",justifyContent:"center",
      fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <style>{`
        *{box-sizing:border-box;}
        input:focus{border-color:${C.accent}!important;box-shadow:0 0 0 3px ${C.accentLight};}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
        .shake{animation:shake .4s ease}
      `}</style>

      {/* Background pattern */}
      <div style={{position:"absolute",inset:0,opacity:.06,backgroundImage:
        "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
        backgroundSize:"20px 20px"}}/>

      <div style={{position:"relative",width:"100%",maxWidth:420,padding:24}}>
        {/* Logo / title */}
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:72,height:72,borderRadius:18,background:"rgba(255,255,255,.12)",
            border:"2px solid rgba(255,255,255,.2)",display:"flex",alignItems:"center",
            justifyContent:"center",fontSize:34,margin:"0 auto 16px",backdropFilter:"blur(10px)"}}>
            🏥
          </div>
          <div style={{color:"#fff",fontSize:22,fontWeight:700,letterSpacing:".03em",marginBottom:4}}>
            MedLIMS
          </div>
          <div style={{color:"rgba(255,255,255,.6)",fontSize:12,letterSpacing:".08em",textTransform:"uppercase"}}>
            {hospital?.name||"Clinical Laboratory"}
          </div>
        </div>

        {/* Card */}
        <div className={shaking?"shake":""} style={{background:"#fff",borderRadius:16,
          boxShadow:"0 24px 60px rgba(0,0,0,.3)",overflow:"hidden"}}>
          <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,
            padding:"16px 24px",textAlign:"center"}}>
            <div style={{fontWeight:700,fontSize:15,color:C.text}}>Sign In</div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>Enter your credentials to continue</div>
          </div>

          <div style={{padding:"24px 24px 20px",display:"flex",flexDirection:"column",gap:16}}>
            {error&&(
              <div style={{background:C.redLight,border:"1px solid #fecaca",borderRadius:6,
                padding:"8px 12px",fontSize:12,color:C.red,display:"flex",alignItems:"center",gap:8}}>
                <span>⚠</span><span>{error}</span>
              </div>
            )}

            <Field label="Username">
              <input value={username} onChange={e=>{setUsername(e.target.value);setError("");}}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                style={inp({width:"100%"})} placeholder="Enter username" autoFocus/>
            </Field>

            <Field label="Password">
              <div style={{position:"relative"}}>
                <input type={showPw?"text":"password"} value={password}
                  onChange={e=>{setPassword(e.target.value);setError("");}}
                  onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                  style={inp({width:"100%",paddingRight:36})} placeholder="Enter password"/>
                <button onClick={()=>setShowPw(v=>!v)}
                  style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",
                    background:"none",border:"none",cursor:"pointer",fontSize:14,color:C.muted,padding:2}}>
                  {showPw?"🙈":"👁"}
                </button>
              </div>
            </Field>

            <button onClick={handleLogin}
              style={{...Btn("primary"),width:"100%",height:38,fontSize:14,justifyContent:"center",
                marginTop:4,background:`linear-gradient(135deg,${C.primary},#2d6099)`,
                boxShadow:"0 4px 12px rgba(26,58,92,.35)"}}>
              Sign In →
            </button>
          </div>


        </div>

        <div style={{textAlign:"center",marginTop:20,fontSize:11,color:"rgba(255,255,255,.35)"}}>
          Laboratory Information Management System v1.0
        </div>
        <div style={{textAlign:"center",marginTop:6,fontSize:9,color:"rgba(255,255,255,.2)",letterSpacing:".03em"}}>
          Created by Bryce Men Kenk C. Ablir, RMT
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ACCOUNTS VIEW (Admin Only)
══════════════════════════════════════════════════════ */
function AccountsView({accounts,onSave,currentUser}){
  const ROLES=["Admin","Staff","Viewer"];
  const blank={name:"",username:"",password:"",role:"Staff"};
  const [form,setForm]=useState(blank);
  const [showForm,setShowForm]=useState(false);
  const [showPw,setShowPw]=useState(false);
  const [editId,setEditId]=useState(null);
  const [deleteTarget,setDeleteTarget]=useState(null); // id to confirm delete

  const isAdmin=currentUser?.role==="Admin";

  const startEdit=a=>{
    setForm({name:a.name,username:a.username,password:a.password,role:a.role});
    setEditId(a.id);setShowForm(true);setShowPw(false);
  };
  const startNew=()=>{setForm(blank);setEditId(null);setShowForm(true);setShowPw(false);};

  const handleSave=()=>{
    if(!form.name||!form.username||!form.password)return alert("Name, username, and password are required.");
    const dup=accounts.find(a=>a.username.toLowerCase()===form.username.toLowerCase()&&a.id!==editId);
    if(dup)return alert(`Username "${form.username}" is already taken.`);
    if(editId){
      onSave(accounts.map(a=>a.id===editId?{...a,...form}:a));
    } else {
      onSave([...accounts,{...form,id:uid(),createdAt:toInputDate(),createdBy:currentUser.username}]);
    }
    setForm(blank);setEditId(null);setShowForm(false);
  };

  const confirmDelete=()=>{
    onSave(accounts.filter(a=>a.id!==deleteTarget));
    setDeleteTarget(null);
  };

  const roleBadge=role=>{
    const map={Admin:{bg:"#fef3c7",color:"#92400e"},Staff:{bg:"#dbeafe",color:"#1e40af"},Viewer:{bg:"#f0fdf4",color:"#166534"}};
    return map[role]||{bg:"#f3f4f6",color:"#374151"};
  };

  const deleteAcc=deleteTarget?accounts.find(a=>a.id===deleteTarget):null;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Inline delete confirmation modal */}
      {deleteTarget&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:999,
          display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"#fff",borderRadius:12,padding:28,maxWidth:380,width:"90%",
            boxShadow:"0 20px 60px rgba(0,0,0,.3)",textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:12}}>🗑</div>
            <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:8}}>Delete Account?</div>
            <div style={{fontSize:13,color:C.muted,marginBottom:20}}>
              This will permanently delete the account for <b>{deleteAcc?.name}</b> ({deleteAcc?.username}). This cannot be undone.
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button style={Btn("ghost")} onClick={()=>setDeleteTarget(null)}>Cancel</button>
              <button style={Btn("danger",{background:C.red,color:"#fff"})} onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontWeight:700,fontSize:18,color:C.text}}>🔐 User Accounts</div>
          <div style={{fontSize:12,color:C.muted,marginTop:2}}>Manage login credentials — Admin access only</div>
        </div>
        {isAdmin&&<button style={Btn("primary")} onClick={startNew}>+ Create Account</button>}
      </div>

      {!isAdmin&&(
        <div style={{background:C.redLight,border:"1px solid #fecaca",borderRadius:8,padding:"14px 18px",
          fontSize:13,color:C.red,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20}}>🔒</span>
          <span>Only administrators can manage user accounts.</span>
        </div>
      )}

      {showForm&&isAdmin&&(
        <Card>
          <CardHead title={editId?"Edit Account":"Create New Account"} icon={editId?"✏":"🔐"}/>
          <div style={{padding:16,display:"flex",gap:12,flexWrap:"wrap"}}>
            <Field label="Full Name *" style={{flex:2,minWidth:180}}>
              <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}
                style={inp({})} placeholder="Full name"/>
            </Field>
            <Field label="Username *" style={{width:160}}>
              <input value={form.username} onChange={e=>setForm(p=>({...p,username:e.target.value}))}
                style={inp({width:160})} placeholder="Username"/>
            </Field>
            <Field label="Password *" style={{width:200}}>
              <div style={{position:"relative"}}>
                <input type={showPw?"text":"password"} value={form.password}
                  onChange={e=>setForm(p=>({...p,password:e.target.value}))}
                  style={inp({width:200,paddingRight:34})} placeholder="Password"/>
                <button onClick={()=>setShowPw(v=>!v)}
                  style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",
                    background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.muted,padding:0}}>
                  {showPw?"🙈":"👁"}
                </button>
              </div>
            </Field>
            <Field label="Role" style={{width:130}}>
              <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} style={inp({width:130})}>
                {ROLES.map(r=><option key={r}>{r}</option>)}
              </select>
            </Field>
          </div>
          <div style={{padding:"10px 16px",borderTop:`1px solid ${C.border}`,background:C.surface,
            display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button style={Btn("ghost")} onClick={()=>{setShowForm(false);setEditId(null);setForm(blank);}}>Cancel</button>
            <button style={Btn("primary")} onClick={handleSave}>{editId?"💾 Save Changes":"+ Create Account"}</button>
          </div>
        </Card>
      )}

      <Card>
        <CardHead title="Role Permissions" icon="ℹ"/>
        <div style={{padding:"12px 16px",display:"flex",gap:24,flexWrap:"wrap"}}>
          {[
            {role:"Admin",  desc:"Full access — manage accounts, all data, settings"},
            {role:"Staff",  desc:"Can enter results, manage patients and personnel"},
            {role:"Viewer", desc:"Read-only — view reports and results, cannot edit"},
          ].map(({role,desc})=>{
            const b=roleBadge(role);
            return(
              <div key={role} style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{padding:"3px 10px",borderRadius:10,fontSize:12,fontWeight:700,
                  background:b.bg,color:b.color}}>{role}</span>
                <span style={{fontSize:12,color:C.muted}}>{desc}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardHead title="All Accounts" sub={`${accounts.length} account${accounts.length!==1?"s":""}`}/>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:C.surface,borderBottom:`1px solid ${C.border}`}}>
            {["Name","Username","Role","Created",""].map(h=>(
              <th key={h} style={{padding:"8px 14px",textAlign:"left",fontSize:11,fontWeight:700,
                color:C.primary,textTransform:"uppercase",letterSpacing:".04em"}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {accounts.length===0&&(
              <tr><td colSpan={5} style={{padding:28,textAlign:"center",color:C.faint,fontSize:12}}>No accounts.</td></tr>
            )}
            {accounts.map((a,i)=>{
              const b=roleBadge(a.role);
              const isSelf=a.id===currentUser?.id;
              const isProtected=a.username==="admin"; // the default seeded admin is always protected
              return(
                <tr key={a.id} style={{borderBottom:`1px solid ${C.border}`,
                  background:isSelf?"#f0f7ff":i%2===0?"#fff":C.surface}}>
                  <td style={{padding:"10px 14px",fontWeight:600}}>
                    {a.name}
                    {isSelf&&<span style={{marginLeft:8,fontSize:10,color:C.accent,fontWeight:700,
                      background:C.accentLight,padding:"1px 7px",borderRadius:8}}>You</span>}
                  </td>
                  <td style={{padding:"10px 14px",fontFamily:"monospace",fontSize:12,color:C.muted}}>
                    {a.username}
                  </td>
                  <td style={{padding:"10px 14px"}}>
                    <span style={{padding:"3px 10px",borderRadius:10,fontSize:11,fontWeight:700,
                      background:b.bg,color:b.color}}>{a.role}</span>
                  </td>
                  <td style={{padding:"10px 14px",color:C.muted,fontSize:11}}>{fmtDate(a.createdAt)}</td>
                  <td style={{padding:"10px 14px"}}>
                    {isAdmin&&(
                      <div style={{display:"flex",gap:6}}>
                        <button style={Btn("ghost",{fontSize:11,height:26,padding:"0 10px"})}
                          onClick={()=>startEdit(a)}>✏ Edit</button>
                        {!isSelf&&!isProtected&&(
                          <button style={Btn("danger",{fontSize:11,height:26,padding:"0 10px"})}
                            onClick={()=>setDeleteTarget(a.id)}>🗑 Delete</button>
                        )}
                        {isProtected&&<span style={{fontSize:11,color:C.faint,padding:"0 6px"}}>protected</span>}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TEMPLATES
══════════════════════════════════════════════════════ */
function TemplatesView({sections, hospital}){
  const [editSec, setEditSec] = useState(null); // null = picker, string = editing
  const [editLabel, setEditLabel] = useState("");
  if(editSec!==null) return <TemplateEditorModule sectionId={editSec||null} sectionLabel={editLabel} hospital={hospital} onBack={()=>setEditSec(null)}/>;
  return <TemplatePicker sections={sections} onSelect={(id,label)=>{setEditSec(id===null?"_master":id);setEditLabel(label);}} onBack={()=>{}}/>;
}

function TemplatePicker({sections,onSelect}){
  const [tpls,setTpls] = useState(()=>({..._templates}));
  useEffect(()=>{const id=setInterval(()=>setTpls({..._templates}),500);return()=>clearInterval(id);},[]);
  const deptTpl=tpls.lab||{};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div>
        <div style={{fontWeight:800,fontSize:16,color:C.text}}>Result Templates</div>
        <div style={{fontSize:11.5,color:C.muted,marginTop:2}}>Customize colors, fonts, positions, signatures, and images per section</div>
      </div>
      <div style={{background:C.accent+"0a",border:`1.5px solid ${C.accent}30`,borderRadius:12,padding:"16px 18px",cursor:"pointer",transition:"all .15s"}}
        onClick={()=>onSelect(null,"Master Template")}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent+"70";}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=C.accent+"30";}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:8,background:C.accent+"20",display:"flex",alignItems:"center",justifyContent:"center",color:C.accent,fontWeight:900,fontSize:14}}>M</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:14,color:C.accent}}>Master Template</div>
            <div style={{fontSize:11,color:C.muted}}>Default for all sections</div>
          </div>
          {deptTpl._master&&<span style={{background:C.accent+"15",color:C.accent,padding:"2px 8px",borderRadius:99,fontSize:9,fontWeight:700}}>Customized</span>}
        </div>
      </div>
      <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".07em"}}>Sections</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
        {sections.map(s=>{
          const t=deptTpl[s.id]; const col=t?.sectionColor||s.color;
          return(
            <div key={s.id} onClick={()=>onSelect(s.id,s.label)}
              style={{background:"#fff",border:`1.5px solid ${t?col+"50":C.border}`,borderRadius:9,padding:"12px 14px",cursor:"pointer",transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=col;e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,.08)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=t?col+"50":C.border;e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="none";}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:col}}/><span style={{fontSize:16}}>{s.icon}</span>
              </div>
              <div style={{fontWeight:700,fontSize:12,color:col}}>{s.label}</div>
              {t?<div style={{fontSize:10,color:col,marginTop:3,fontWeight:600}}>Customized</div>:<div style={{fontSize:10,color:C.faint,marginTop:3}}>Uses master</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TemplateEditorModule({ sectionId, sectionLabel, hospital, onBack }) {
  const [flash, setFlash] = useState(false);
  const tplKey = sectionId || "_master";
  const sLabel = sectionLabel || (tplKey==="_master"?"Master Template":tplKey);
  const sec = SECTIONS.find(s=>s.id===sectionId);
  const saved = (_templates.lab||{})[tplKey] || {};

  // ── Section color ──
  const usedColors = []; const deptTpls = _templates.lab||{};
  Object.entries(deptTpls).forEach(([k,v])=>{if(k!==tplKey&&v.sectionColor)usedColors.push(v.sectionColor);});
  const defaultColor = sec?.color||C.accent;
  const [sectionColor, setSectionColor] = useState(saved.sectionColor||defaultColor);

  // ── Content blocks ──
  const defs = defaultBlocks(sLabel);
  const initBlock = (key) => ({...defs[key], ...(saved.blocks?.[key]||{})});
  const [blocks, setBlocks] = useState({
    clinicHeader:initBlock("clinicHeader"), deptLabel:initBlock("deptLabel"),
    addressLine:initBlock("addressLine"), phoneLine:initBlock("phoneLine"),
    reportTitle:initBlock("reportTitle"), patientInfo:initBlock("patientInfo"),
    resultsTable:initBlock("resultsTable"), signatures:initBlock("signatures"),
  });
  const updateBlock = (key, u) => setBlocks(prev=>({...prev,[key]:{...prev[key],...u}}));

  // ── Header overrides ──
  const [clinicName, setClinicName] = useState(saved.clinicName||"");
  const [deptNameOvr, setDeptNameOvr] = useState(saved.deptName||"Laboratory Department");
  const [addressOvr, setAddressOvr] = useState(saved.address||"");
  const [phoneOvr, setPhoneOvr] = useState(saved.phone||"");
  const [showAddress, setShowAddress] = useState(saved.showAddress!==false);
  const [showPhone, setShowPhone] = useState(saved.showPhone!==false);
  const [reportTitleVal, setReportTitleVal] = useState(saved.reportTitle||blocks.reportTitle.text||(sLabel.toUpperCase()+" REPORT"));

  // ── Patient fields ──
  const allPF=[{id:"name",label:"Patient Name"},{id:"age_sex",label:"Age / Sex"},{id:"dob",label:"Date of Birth"},{id:"date_time",label:"Date & Time"},{id:"ward",label:"Ward"},{id:"physician",label:"Physician"},{id:"patient_id",label:"Patient ID"}];
  const [patientFields, setPatientFields] = useState(saved.patientFields||["name","age_sex","dob","date_time","ward","physician"]);

  // ── Signatures ──
  const [sigs, setSigs] = useState(saved.signatures||JSON.parse(JSON.stringify(DEFAULT_SIGS.lab)));

  // ── Floating images & texts ──
  const [floatImages, setFloatImages] = useState((saved.floatImages||[]).map(i=>({behindText:false,...i})));
  const [floatTexts, setFloatTexts] = useState(saved.floatTexts||[]);
  const [selImg, setSelImg] = useState(null);
  const [selTxt, setSelTxt] = useState(null);
  const floatFileRef = useRef(null);

  // ── Drag state ──
  const [drag, setDrag] = useState(null);
  const [selBlock, setSelBlock] = useState(null);

  useEffect(()=>{
    if(!drag) return;
    const onMove = e => {
      const dy = e.clientY - drag.startY;
      if(drag.type==="block") updateBlock(drag.id, {y:Math.max(0,Math.min(400,drag.origY+dy))});
      else if(drag.type==="img") setFloatImages(p=>p.map(i=>i.id===drag.id?{...i,x:Math.max(0,drag.origX+(e.clientX-drag.startX)),y:Math.max(0,drag.origY+dy)}:i));
      else if(drag.type==="txt") setFloatTexts(p=>p.map(t=>t.id===drag.id?{...t,x:Math.max(0,drag.origX+(e.clientX-drag.startX)),y:Math.max(0,drag.origY+dy)}:t));
      else if(drag.type==="resize") setFloatImages(p=>p.map(i=>i.id===drag.id?{...i,width:Math.max(20,drag.origW+(e.clientX-drag.startX)),height:Math.max(15,drag.origH+dy)}:i));
    };
    const onUp = () => setDrag(null);
    window.addEventListener("mousemove",onMove);
    window.addEventListener("mouseup",onUp);
    return()=>{window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseup",onUp);};
  },[drag]);

  const handleFloatImageUpload = e => {
    const file=e.target.files?.[0];if(!file)return;if(file.size>3*1024*1024){alert("Max 3MB");return;}
    const reader=new FileReader();
    reader.onload=ev=>{const id="fi_"+uid();setFloatImages(p=>[...p,{id,src:ev.target.result,x:30,y:30+Math.random()*50,width:120,height:60,opacity:1,behindText:false,label:file.name.replace(/\.[^.]+$/,"")}]);setSelImg(id);};
    reader.readAsDataURL(file);e.target.value="";
  };
  const deleteFloatImg=id=>{setFloatImages(p=>p.filter(i=>i.id!==id));if(selImg===id)setSelImg(null);};
  const updateFloatImg=(id,u)=>setFloatImages(p=>p.map(i=>i.id===id?{...i,...u}:i));

  // ── Save ──
  const save = () => {
    const updated=JSON.parse(JSON.stringify(_templates));
    if(!updated.lab)updated.lab={};
    const tplData={
      clinicName,deptName:deptNameOvr,address:addressOvr,phone:phoneOvr,
      showAddress,showPhone,reportTitle:reportTitleVal,sectionColor,
      blocks,signatures:sigs,patientFields,
      floatImages,floatTexts,
      updatedAt:new Date().toISOString(),
    };
    updated.lab[tplKey]=tplData;

    // ── Master template: propagate to all sub-templates that haven't been independently customized ──
    if(tplKey==="_master"){
      SECTIONS.forEach(sec=>{
        const existing=updated.lab[sec.id];
        // Only propagate to sub-templates that don't exist yet OR were never explicitly saved by user
        // We identify "untouched" sub-templates as ones with no updatedAt (never saved manually)
        if(!existing||!existing._userCustomized){
          // Preserve any section-specific color if the sub-template had one
          const preservedColor=existing?.sectionColor||sec.color;
          updated.lab[sec.id]={
            ...tplData,
            sectionColor:preservedColor,
            reportTitle:(sec.label.toUpperCase()+" REPORT"),
            _inheritedFromMaster:true,
            updatedAt:new Date().toISOString(),
          };
        } else {
          // Sub-template was user-customized — only push non-layout fields: clinic name, address, phone, signatures, patient fields
          updated.lab[sec.id]={
            ...existing,
            clinicName:tplData.clinicName,
            deptName:tplData.deptName,
            address:tplData.address,
            phone:tplData.phone,
            showAddress:tplData.showAddress,
            showPhone:tplData.showPhone,
            floatImages:tplData.floatImages,
            floatTexts:tplData.floatTexts,
            signatures:tplData.signatures,
            patientFields:tplData.patientFields,
          };
        }
      });
    } else {
      // Mark this sub-template as user-customized so master won't overwrite layout
      updated.lab[tplKey]._userCustomized=true;
    }

    saveTemplates(updated);setFlash(true);setTimeout(()=>setFlash(false),2000);
  };

  const reset = () => {
    if(!confirm("Reset this template to defaults?"))return;
    const d=defaultBlocks(sLabel);
    setBlocks({clinicHeader:d.clinicHeader,deptLabel:d.deptLabel,addressLine:d.addressLine,phoneLine:d.phoneLine,reportTitle:d.reportTitle,patientInfo:d.patientInfo,resultsTable:d.resultsTable,signatures:d.signatures});
    setClinicName("");setDeptNameOvr("Laboratory Department");setAddressOvr("");setPhoneOvr("");
    setShowAddress(true);setShowPhone(true);setReportTitleVal(sLabel.toUpperCase()+" REPORT");
    setSectionColor(defaultColor);setSigs(JSON.parse(JSON.stringify(DEFAULT_SIGS.lab)));
    setPatientFields(["name","age_sex","dob","date_time","ward","physician"]);
    setFloatImages([]);setFloatTexts([]);setSelBlock(null);setSelImg(null);setSelTxt(null);
  };

  const hexToRgb=hex=>{if(!hex||hex[0]!=="#")return[0,0,0];return[parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)];};
  const sc=hexToRgb(sectionColor);

  // ── Block settings editor ──
  const BlockSettings = ({bKey, label, block}) => {
    const hasFontSettings = true;
    const hasAlignColor = ["clinicHeader","deptLabel","addressLine","phoneLine","reportTitle"].includes(bKey);
    return(
      <div style={{padding:10,background:C.surface,borderRadius:6,border:`1px solid ${C.border}`,marginBottom:6}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
          <span style={{fontWeight:700,fontSize:11,color:C.text}}>{label}</span>
          <span style={{fontSize:9,color:C.faint}}>Y: {Math.round(block.y)}px</span>
        </div>
        {hasFontSettings&&<div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:1}}>
            <button onClick={()=>updateBlock(bKey,{fontSize:Math.max(5,(block.fontSize||12)-1)})} style={{width:18,height:22,border:`1px solid ${C.border}`,borderRadius:"3px 0 0 3px",fontSize:11,background:"#fff",cursor:"pointer",color:C.text,fontWeight:700,lineHeight:1}}>−</button>
            <input type="number" min={5} max={48} value={block.fontSize||12} onChange={e=>updateBlock(bKey,{fontSize:Math.max(5,Math.min(48,parseInt(e.target.value)||12))})}
              style={{width:30,height:22,border:`1px solid ${C.border}`,borderLeft:"none",borderRight:"none",fontSize:10,textAlign:"center",fontWeight:600,outline:"none",fontFamily:"inherit",MozAppearance:"textfield",WebkitAppearance:"none"}}/>
            <button onClick={()=>updateBlock(bKey,{fontSize:Math.min(48,(block.fontSize||12)+1)})} style={{width:18,height:22,border:`1px solid ${C.border}`,borderRadius:"0 3px 3px 0",fontSize:11,background:"#fff",cursor:"pointer",color:C.text,fontWeight:700,lineHeight:1}}>+</button>
          </div>
          {hasAlignColor&&<>
          <button onClick={()=>updateBlock(bKey,{bold:!block.bold})} style={{width:22,height:22,border:`1px solid ${C.border}`,borderRadius:3,fontWeight:900,fontSize:11,background:block.bold?C.accentLight:"#fff",cursor:"pointer",color:C.text}}>B</button>
          <label style={{position:"relative",width:22,height:22,border:`1px solid ${C.border}`,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"#fff"}}>
            <span style={{fontSize:12,fontWeight:900,color:block.color||"#000"}}>A</span>
            <input type="color" value={block.color||"#000000"} onChange={e=>updateBlock(bKey,{color:e.target.value})} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer"}}/>
          </label>
          {["left","center","right"].map(a=><button key={a} onClick={()=>updateBlock(bKey,{align:a})} style={{width:22,height:22,border:"1px solid "+(block.align===a?C.accent:C.border),borderRadius:3,fontSize:9,background:block.align===a?C.accentLight:"#fff",cursor:"pointer",color:C.text}}>{a[0].toUpperCase()}</button>)}
          </>}
        </div>}
        <input type="range" min={0} max={400} value={Math.min(block.y,400)} onChange={e=>updateBlock(bKey,{y:parseInt(e.target.value)})} style={{width:"100%",marginTop:4,accentColor:sectionColor}} title="Vertical position (top half only)"/>
        {bKey==="resultsTable"&&<div style={{marginTop:6}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:2}}>
            <span style={{fontSize:10,fontWeight:600,color:C.muted}}>Row Spacing</span>
            <span style={{fontSize:9,color:C.faint}}>{(block.rowSpacing||1.6).toFixed(1)}mm</span>
          </div>
          <input type="range" min={0.5} max={5} step={0.1} value={block.rowSpacing||1.6} onChange={e=>updateBlock(bKey,{rowSpacing:parseFloat(e.target.value)})} style={{width:"100%",accentColor:sectionColor}} title="Row spacing (cell padding in mm)"/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:C.faint}}><span>Tight</span><span>Spacious</span></div>
        </div>}
      </div>
    );
  };

  const sampleLines=[{testName:"Sample Test 1",value:"5.2",unit:"mg/dL",normalRange:"3.5-7.0",flag:"",group:"Lipid Profile"},{testName:"Sample Test 2",value:"142",unit:"mmol/L",normalRange:"136-145",flag:"",group:"Lipid Profile"},{testName:"Sample Test 3",value:"3.1",unit:"g/dL",normalRange:"3.5-5.5",flag:"LO",group:"Electrolytes"}];

  // Preview block renderer (draggable)
  const PBlock = ({bKey, children}) => {
    const b = blocks[bKey];
    const isSel = selBlock===bKey;
    return(
      <div
        onMouseDown={e=>{if(e.target.dataset?.noDrag)return;e.preventDefault();setSelBlock(bKey);setSelImg(null);setSelTxt(null);setDrag({type:"block",id:bKey,startY:e.clientY,origY:b.y});}}
        onClick={e=>{e.stopPropagation();setSelBlock(bKey);setSelImg(null);setSelTxt(null);}}
        style={{position:"absolute",left:30,right:30,top:b.y,cursor:drag?.id===bKey?"grabbing":"grab",
          border:isSel?"1.5px dashed "+sectionColor:"1.5px dashed transparent",
          borderRadius:3,padding:"2px 4px",transition:drag?"none":"border .15s",
          background:isSel?"rgba(37,99,235,.03)":"transparent",zIndex:isSel?5:2,userSelect:"none"}}>
        {children}
        {isSel&&<div style={{position:"absolute",left:-18,top:"50%",transform:"translateY(-50%)",fontSize:10,color:sectionColor,cursor:"ns-resize",userSelect:"none"}}>⠿</div>}
      </div>
    );
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <button onClick={onBack} style={{...Btn("ghost"),fontSize:12}}>← Back</button>
        <div style={{flex:1}}><div style={{fontWeight:800,fontSize:15,color:C.text}}>{sLabel} — Template</div></div>
        <button onClick={reset} style={{padding:"5px 12px",border:`1px solid ${C.border}`,background:"#fff",borderRadius:6,color:C.muted,fontWeight:600,fontSize:11,cursor:"pointer"}}>Reset</button>
        <button onClick={save} style={{padding:"5px 16px",background:sectionColor,border:"none",borderRadius:6,color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer"}}>{flash?(tplKey==="_master"?"✓ Applied to All":"✓ Saved"):(tplKey==="_master"?"Save & Apply to All":"Save Template")}</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:12,alignItems:"start"}}>
        {/* ═══ LEFT: Controls ═══ */}
        <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:"calc(100vh - 140px)",overflowY:"auto",overflowX:"hidden",paddingRight:4}}>

          {/* Section Color */}
          <div style={{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,boxShadow:"0 1px 4px rgba(15,45,74,.06)"}}>
            <div style={{padding:"10px 12px"}}>
              <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:6}}>Section Color</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(9,1fr)",gap:3}}>
                {PRESET_COLORS.map(c=>{const taken=usedColors.includes(c);return <div key={c} onClick={()=>!taken&&setSectionColor(c)} style={{width:"100%",paddingBottom:"100%",borderRadius:4,background:c,cursor:taken?"not-allowed":"pointer",border:sectionColor===c?"2.5px solid #111":"2px solid transparent",opacity:taken?.2:1,boxSizing:"border-box"}} title={taken?"Used":c}/>;
                })}
              </div>
              <div style={{marginTop:6,display:"flex",alignItems:"center",gap:6}}>
                <input type="color" value={sectionColor} onChange={e=>setSectionColor(e.target.value)} style={{width:28,height:20,border:`1px solid ${C.border}`,borderRadius:3,cursor:"pointer"}}/>
                <span style={{fontSize:10,fontFamily:"monospace",color:C.faint}}>{sectionColor}</span>
              </div>
            </div>
          </div>

          {/* Block positions & font settings */}
          <div style={{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,boxShadow:"0 1px 4px rgba(15,45,74,.06)"}}>
            <div style={{padding:"10px 12px"}}>
              <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:6}}>Content Blocks <span style={{fontSize:9,color:C.faint,fontWeight:400}}>— drag on preview or use sliders</span></div>
              <BlockSettings bKey="clinicHeader" label="Clinic Name" block={blocks.clinicHeader}/>
              <BlockSettings bKey="deptLabel" label="Department Label" block={blocks.deptLabel}/>
              {showAddress&&<BlockSettings bKey="addressLine" label="Address" block={blocks.addressLine}/>}
              {showPhone&&<BlockSettings bKey="phoneLine" label="Phone" block={blocks.phoneLine}/>}
              <BlockSettings bKey="reportTitle" label="Report Title" block={blocks.reportTitle}/>
              <BlockSettings bKey="patientInfo" label="Patient Info" block={blocks.patientInfo}/>
              <BlockSettings bKey="resultsTable" label="Results Table" block={blocks.resultsTable}/>
              <BlockSettings bKey="signatures" label="Signatures" block={blocks.signatures}/>
            </div>
          </div>

          {/* Header text overrides */}
          <div style={{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,boxShadow:"0 1px 4px rgba(15,45,74,.06)"}}>
            <div style={{padding:"10px 12px"}}>
              <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:6}}>Header Text</div>
              {[["Clinic Name","cn",clinicName,setClinicName],["Dept Label","dn",deptNameOvr,setDeptNameOvr],["Address","ad",addressOvr,setAddressOvr],["Phone","ph",phoneOvr,setPhoneOvr],["Report Title","rt",reportTitleVal,setReportTitleVal]].map(([l,k,v,s])=>
                <div key={k} style={{marginBottom:4}}><div style={{fontSize:9,fontWeight:600,color:C.faint}}>{l}</div>
                <input value={v} onChange={e=>s(e.target.value)} placeholder="Default" style={{width:"100%",padding:"4px 6px",border:`1px solid ${C.border}`,borderRadius:4,fontSize:10,fontFamily:"inherit"}}/></div>
              )}
              <div style={{display:"flex",gap:10,marginTop:4}}>
                {[["Address",showAddress,setShowAddress],["Phone",showPhone,setShowPhone]].map(([l,v,s])=><label key={l} style={{fontSize:10,display:"flex",alignItems:"center",gap:3,cursor:"pointer"}}><input type="checkbox" checked={v} onChange={e=>s(e.target.checked)} style={{accentColor:sectionColor}}/>{l}</label>)}
              </div>
            </div>
          </div>

          {/* Patient fields */}
          <div style={{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,boxShadow:"0 1px 4px rgba(15,45,74,.06)"}}>
            <div style={{padding:"10px 12px"}}>
              <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:4}}>Patient Info Fields</div>
              {allPF.map(f=><label key={f.id} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,cursor:"pointer",padding:"1px 0"}}><input type="checkbox" checked={patientFields.includes(f.id)} onChange={e=>setPatientFields(p=>e.target.checked?[...p,f.id]:p.filter(x=>x!==f.id))} style={{accentColor:sectionColor}}/>{f.label}</label>)}
            </div>
          </div>

          {/* Signatures */}
          <div style={{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,boxShadow:"0 1px 4px rgba(15,45,74,.06)"}}>
            <div style={{padding:"10px 12px"}}>
              <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:6}}>Signatories</div>
              {sigs.map((sig,i)=><div key={i} style={{display:"flex",gap:4,alignItems:"center",marginBottom:4}}>
                <input value={sig.role} onChange={e=>{const n=[...sigs];n[i]={...n[i],role:e.target.value};setSigs(n);}} style={{flex:1,padding:"3px 6px",border:`1px solid ${C.border}`,borderRadius:3,fontSize:10}}/>
                <input value={sig.field} onChange={e=>{const n=[...sigs];n[i]={...n[i],field:e.target.value};setSigs(n);}} placeholder="field" style={{width:60,padding:"3px 6px",border:`1px solid ${C.border}`,borderRadius:3,fontSize:9,fontFamily:"monospace"}}/>
                <label style={{fontSize:8,display:"flex",alignItems:"center",gap:2,cursor:"pointer"}}><input type="checkbox" checked={sig.showLic} onChange={e=>{const n=[...sigs];n[i]={...n[i],showLic:e.target.checked};setSigs(n);}} style={{width:10,height:10}}/>Lic</label>
                <button onClick={()=>setSigs(sigs.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:12,fontWeight:700}}>×</button>
              </div>)}
              <button onClick={()=>setSigs([...sigs,{role:"New Role",field:"sig",showLic:true}])} style={{fontSize:10,color:sectionColor,background:"none",border:`1px dashed ${sectionColor}40`,borderRadius:4,padding:"3px 8px",cursor:"pointer",fontWeight:600,width:"100%"}}>+ Add</button>
            </div>
          </div>

          {/* Floating images & text */}
          <div style={{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,boxShadow:"0 1px 4px rgba(15,45,74,.06)"}}>
            <div style={{padding:"10px 12px"}}>
              <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:6}}>Floating Images & Text</div>
              <input ref={floatFileRef} type="file" accept="image/*" onChange={handleFloatImageUpload} style={{display:"none"}}/>
              <div style={{display:"flex",gap:4,marginBottom:6}}>
                <button onClick={()=>floatFileRef.current?.click()} style={{flex:1,fontSize:10,color:"#7c3aed",background:"#f5f3ff",border:"1px solid #c4b5fd",borderRadius:4,padding:"4px 0",cursor:"pointer",fontWeight:600}}>+ Image</button>
                <button onClick={()=>setFloatTexts(p=>[...p,{id:"ft_"+uid(),text:"Text",x:40,y:100,fontSize:12,bold:false,color:"#000000"}])} style={{flex:1,fontSize:10,color:"#0369a1",background:"#f0f9ff",border:"1px solid #7dd3fc",borderRadius:4,padding:"4px 0",cursor:"pointer",fontWeight:600}}>+ Text</button>
              </div>
              {floatImages.map(img=><div key={img.id} onClick={()=>{setSelImg(img.id);setSelTxt(null);setSelBlock(null);}} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 4px",borderRadius:3,cursor:"pointer",background:selImg===img.id?"#f5f3ff":"transparent",marginBottom:2,fontSize:9}}>
                <img src={img.src} style={{width:20,height:14,objectFit:"contain",borderRadius:2,border:`1px solid ${C.border}`}} alt=""/>
                <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:C.text}}>{img.label||"Img"}</span>
                <label title="Behind text" style={{display:"flex",alignItems:"center",gap:1,cursor:"pointer",color:img.behindText?"#7c3aed":C.faint}}><input type="checkbox" checked={!!img.behindText} onChange={e=>{e.stopPropagation();updateFloatImg(img.id,{behindText:e.target.checked});}} style={{width:9,height:9}}/>Bh</label>
                <button onClick={e=>{e.stopPropagation();deleteFloatImg(img.id);}} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontWeight:700}}>×</button>
              </div>)}
              {floatTexts.map(ft=><div key={ft.id} onClick={()=>{setSelTxt(ft.id);setSelImg(null);setSelBlock(null);}} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 4px",borderRadius:3,cursor:"pointer",background:selTxt===ft.id?"#f0f9ff":"transparent",marginBottom:2,fontSize:9}}>
                <span style={{flex:1,color:ft.color||C.text,fontWeight:ft.bold?700:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ft.text||"(empty)"}</span>
                <button onClick={e=>{e.stopPropagation();setFloatTexts(p=>p.filter(t=>t.id!==ft.id));if(selTxt===ft.id)setSelTxt(null);}} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontWeight:700}}>×</button>
              </div>)}
              {selImg&&floatImages.find(i=>i.id===selImg)&&(()=>{const img=floatImages.find(i=>i.id===selImg);return <div style={{padding:6,background:"#faf5ff",borderRadius:4,border:"1px solid #e9d5ff",marginTop:4}}>
                <div style={{display:"flex",gap:3,marginBottom:3}}>{[["X",img.x,"x"],["Y",img.y,"y"],["W",img.width,"width"],["H",img.height,"height"]].map(([l,v,k])=><div key={k} style={{flex:1}}><div style={{fontSize:7,fontWeight:700,color:"#7c3aed"}}>{l}</div><input type="number" value={Math.round(v)} onChange={e=>updateFloatImg(img.id,{[k]:parseFloat(e.target.value)||0})} style={{width:"100%",padding:"1px 2px",border:"1px solid #e0d5f0",borderRadius:2,fontSize:9,fontFamily:"monospace"}}/></div>)}</div>
                <div style={{fontSize:7,color:"#7c3aed",fontWeight:700}}>Opacity {Math.round((img.opacity??1)*100)}%</div>
                <input type="range" min="0.05" max="1" step="0.05" value={img.opacity??1} onChange={e=>updateFloatImg(img.id,{opacity:parseFloat(e.target.value)})} style={{width:"100%",accentColor:"#7c3aed"}}/>
              </div>;})()}
              {selTxt&&floatTexts.find(t=>t.id===selTxt)&&(()=>{const ft=floatTexts.find(t=>t.id===selTxt);const up=u=>setFloatTexts(p=>p.map(t=>t.id===ft.id?{...t,...u}:t));return <div style={{padding:6,background:"#f0f9ff",borderRadius:4,border:"1px solid #bae6fd",marginTop:4}}>
                <input value={ft.text} onChange={e=>up({text:e.target.value})} style={{width:"100%",padding:"3px 5px",border:"1px solid #bae6fd",borderRadius:3,fontSize:10,marginBottom:3}}/>
                <div style={{display:"flex",gap:3,alignItems:"center"}}><input type="number" value={ft.fontSize||12} min={6} max={48} onChange={e=>up({fontSize:parseInt(e.target.value)||12})} style={{width:36,padding:"1px 2px",border:"1px solid #bae6fd",borderRadius:2,fontSize:9}}/><input type="color" value={ft.color||"#000"} onChange={e=>up({color:e.target.value})} style={{width:20,height:18,border:"1px solid #bae6fd",borderRadius:2,cursor:"pointer"}}/><button onClick={()=>up({bold:!ft.bold})} style={{width:20,height:18,border:"1px solid "+(ft.bold?C.accent:"#bae6fd"),borderRadius:2,fontWeight:900,fontSize:10,background:ft.bold?C.accentLight:"#fff",cursor:"pointer"}}>B</button></div>
              </div>;})()}
            </div>
          </div>
        </div>

        {/* ═══ RIGHT: Live Preview ═══ */}
        <div>
          <div style={{fontSize:9,fontWeight:700,color:C.faint,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>Live Preview — drag blocks to reposition · Legal Page 8.5″ × 14″ (content prints in top half only)</div>
          <div onClick={()=>{setSelBlock(null);setSelImg(null);setSelTxt(null);}} style={{
            background:"#fff",border:`1px solid ${C.border}`,borderRadius:3,
            boxShadow:"0 4px 20px rgba(0,0,0,.1)",
            width:500,height:824,margin:"0 auto",position:"relative",overflow:"hidden",
            fontFamily:"'Times New Roman',Times,serif",color:"#111",
          }}>
            {/* Bottom half shade — shows the fold/unused area */}
            <div style={{position:"absolute",left:0,right:0,top:412,bottom:0,background:"repeating-linear-gradient(45deg,transparent,transparent 4px,rgba(0,0,0,.03) 4px,rgba(0,0,0,.03) 8px)",zIndex:0,pointerEvents:"none"}}/>
            <div style={{position:"absolute",left:0,right:0,top:412,borderTop:"2px dashed #ccc",zIndex:1,pointerEvents:"none"}}/>
            <div style={{position:"absolute",right:6,top:416,fontSize:8,color:"#bbb",pointerEvents:"none",zIndex:1}}>— fold line — content above only —</div>

            {/* Floating behind-text images */}
            {floatImages.filter(fi=>fi.behindText).map(img=>{const isSel=selImg===img.id;return <div key={img.id} onMouseDown={e=>{e.preventDefault();e.stopPropagation();setSelImg(img.id);setSelTxt(null);setSelBlock(null);setDrag({type:"img",id:img.id,startX:e.clientX,startY:e.clientY,origX:img.x,origY:img.y});}} onClick={e=>e.stopPropagation()} style={{position:"absolute",left:img.x,top:img.y,width:img.width,height:img.height,zIndex:0,cursor:"grab",opacity:img.opacity??1,border:isSel?"2px solid #7c3aed":"2px solid transparent",boxSizing:"border-box",userSelect:"none"}}><img src={img.src} draggable={false} style={{width:"100%",height:"100%",objectFit:"contain",pointerEvents:"none"}} alt=""/>{isSel&&<><div onClick={e=>{e.stopPropagation();deleteFloatImg(img.id);}} style={{position:"absolute",top:-8,right:-8,width:16,height:16,borderRadius:"50%",background:C.red,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,cursor:"pointer"}}>×</div><div onMouseDown={e=>{e.preventDefault();e.stopPropagation();setDrag({type:"resize",id:img.id,startX:e.clientX,startY:e.clientY,origW:img.width,origH:img.height});}} style={{position:"absolute",bottom:-4,right:-4,width:8,height:8,background:"#7c3aed",borderRadius:1,cursor:"nwse-resize"}}/></>}</div>;})}

            {/* Content blocks */}
            <PBlock bKey="clinicHeader"><div style={{textAlign:blocks.clinicHeader.align,fontSize:blocks.clinicHeader.fontSize,fontWeight:blocks.clinicHeader.bold?800:400,color:blocks.clinicHeader.color}}>{clinicName||hospital?.name||"{Clinic Name}"}</div></PBlock>
            <PBlock bKey="deptLabel"><div style={{textAlign:blocks.deptLabel.align,fontSize:blocks.deptLabel.fontSize,fontWeight:blocks.deptLabel.bold?700:400,color:blocks.deptLabel.color}}>{deptNameOvr}</div></PBlock>
            {showAddress&&<PBlock bKey="addressLine"><div style={{textAlign:blocks.addressLine.align,fontSize:blocks.addressLine.fontSize,color:blocks.addressLine.color}}>{addressOvr||hospital?.address||"{Address}"}</div></PBlock>}
            {showPhone&&<PBlock bKey="phoneLine"><div style={{textAlign:blocks.phoneLine.align,fontSize:blocks.phoneLine.fontSize,color:blocks.phoneLine.color}}>Tel: {phoneOvr||hospital?.phone||"{Phone}"}</div></PBlock>}
            <PBlock bKey="reportTitle"><div style={{textAlign:blocks.reportTitle.align,fontSize:blocks.reportTitle.fontSize,fontWeight:blocks.reportTitle.bold?800:400,color:blocks.reportTitle.color||sectionColor}}>{reportTitleVal}</div></PBlock>

            <PBlock bKey="patientInfo">
              <table style={{width:"100%",fontSize:blocks.patientInfo.fontSize||10,borderCollapse:"collapse"}}>
                <tbody>{Array.from({length:Math.ceil(patientFields.length/2)}).map((_,i)=>{const f1=allPF.find(f=>f.id===patientFields[i*2]),f2=allPF.find(f=>f.id===patientFields[i*2+1]);return <tr key={i}>{f1&&<><td style={{padding:"1px 0",color:"#666",width:"22%"}}>{f1.label}:</td><td style={{padding:"1px 0",fontWeight:700}}>{"{"}{f1.id}{"}"}</td></>}{f2&&<><td style={{padding:"1px 0",color:"#666",width:"22%"}}>{f2.label}:</td><td style={{padding:"1px 0",fontWeight:700}}>{"{"}{f2.id}{"}"}</td></>}{!f2&&f1&&<><td/><td/></>}</tr>;})}</tbody>
              </table>
            </PBlock>

            <PBlock bKey="resultsTable">
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:blocks.resultsTable.fontSize||9}}>
                <thead><tr style={{background:`rgb(${sc.join(",")})`,color:"#fff"}}><th style={{padding:"3px 6px",textAlign:"left",fontSize:7}}>TEST</th><th style={{padding:"3px 6px",textAlign:"center",fontSize:7}}>RESULT</th><th style={{padding:"3px 6px",textAlign:"center",fontSize:7}}>UNIT</th><th style={{padding:"3px 6px",textAlign:"center",fontSize:7}}>NORMAL</th><th style={{padding:"3px 6px",textAlign:"center",fontSize:7}}>FLAG</th></tr></thead>
                <tbody>{(()=>{
                  const rsPx=(blocks.resultsTable.rowSpacing||1.6)*2.5; // convert mm-ish to preview px
                  let lastGrp="";
                  return sampleLines.map((l,i)=>{
                    const rows=[];
                    if(l.group&&l.group!==lastGrp){
                      rows.push(<tr key={"g_"+i}><td colSpan={5} style={{padding:`${rsPx+2}px 6px ${rsPx*0.3}px 2px`,fontSize:blocks.resultsTable.fontSize||9,fontWeight:700,color:`rgb(${sc.join(",")})`}}>{l.group}</td></tr>);
                      lastGrp=l.group;
                    }
                    rows.push(<tr key={i} style={{borderBottom:"1px solid #eee"}}><td style={{padding:`${rsPx}px 6px ${rsPx}px ${l.group?"14px":"6px"}`,fontSize:blocks.resultsTable.fontSize?blocks.resultsTable.fontSize-1:8}}>{l.testName}</td><td style={{padding:`${rsPx}px 6px`,fontSize:blocks.resultsTable.fontSize?blocks.resultsTable.fontSize-1:8,textAlign:"center",fontWeight:700,color:l.flag==="LO"?"#1a6fb5":"#111"}}>{l.value}</td><td style={{padding:`${rsPx}px 6px`,fontSize:(blocks.resultsTable.fontSize||9)-2,textAlign:"center",color:"#888"}}>{l.unit}</td><td style={{padding:`${rsPx}px 6px`,fontSize:(blocks.resultsTable.fontSize||9)-2,textAlign:"center",color:"#666"}}>{l.normalRange}</td><td style={{padding:`${rsPx}px 6px`,fontSize:(blocks.resultsTable.fontSize||9)-2,textAlign:"center",fontWeight:700,color:l.flag==="LO"?"#1a6fb5":"#ccc"}}>{l.flag||""}</td></tr>);
                    return rows;
                  });
                })()}</tbody>
              </table>
            </PBlock>

            <PBlock bKey="signatures">
              <div style={{display:"flex",justifyContent:"space-around"}}>
                {sigs.map((s,i)=><div key={i} style={{textAlign:"center"}}><hr style={{width:80,margin:"0 auto 3px",border:"none",borderTop:"1px solid #333"}}/><div style={{fontWeight:700,fontSize:8}}>{"{"}{s.field}{"}"}</div>{s.showLic&&<div style={{fontSize:6,color:"#999"}}>Lic. No. ___</div>}<div style={{fontSize:6,color:"#666"}}>{s.role}</div></div>)}
              </div>
            </PBlock>

            {/* Floating on-top images */}
            {floatImages.filter(fi=>!fi.behindText).map(img=>{const isSel=selImg===img.id;return <div key={img.id} onMouseDown={e=>{e.preventDefault();e.stopPropagation();setSelImg(img.id);setSelTxt(null);setSelBlock(null);setDrag({type:"img",id:img.id,startX:e.clientX,startY:e.clientY,origX:img.x,origY:img.y});}} onClick={e=>e.stopPropagation()} style={{position:"absolute",left:img.x,top:img.y,width:img.width,height:img.height,zIndex:10+(isSel?50:0),cursor:"grab",opacity:img.opacity??1,border:isSel?"2px solid #7c3aed":"2px solid transparent",boxSizing:"border-box",userSelect:"none"}}><img src={img.src} draggable={false} style={{width:"100%",height:"100%",objectFit:"contain",pointerEvents:"none"}} alt=""/>{isSel&&<><div onClick={e=>{e.stopPropagation();deleteFloatImg(img.id);}} style={{position:"absolute",top:-8,right:-8,width:16,height:16,borderRadius:"50%",background:C.red,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,cursor:"pointer"}}>×</div><div onMouseDown={e=>{e.preventDefault();e.stopPropagation();setDrag({type:"resize",id:img.id,startX:e.clientX,startY:e.clientY,origW:img.width,origH:img.height});}} style={{position:"absolute",bottom:-4,right:-4,width:8,height:8,background:"#7c3aed",borderRadius:1,cursor:"nwse-resize"}}/></>}</div>;})}

            {/* Floating texts */}
            {floatTexts.map(ft=>{const isSel=selTxt===ft.id;return <div key={ft.id} onMouseDown={e=>{e.preventDefault();e.stopPropagation();setSelTxt(ft.id);setSelImg(null);setSelBlock(null);setDrag({type:"txt",id:ft.id,startX:e.clientX,startY:e.clientY,origX:ft.x,origY:ft.y});}} onClick={e=>e.stopPropagation()} style={{position:"absolute",left:ft.x,top:ft.y,zIndex:15+(isSel?50:0),cursor:"grab",userSelect:"none",fontSize:ft.fontSize||12,fontWeight:ft.bold?700:400,color:ft.color||"#000",whiteSpace:"nowrap",border:isSel?"1.5px dashed #0369a1":"1.5px dashed transparent",padding:"1px 3px",borderRadius:2}}>{ft.text||"Text"}{isSel&&<div onClick={e=>{e.stopPropagation();setFloatTexts(p=>p.filter(t=>t.id!==ft.id));setSelTxt(null);}} style={{position:"absolute",top:-8,right:-8,width:14,height:14,borderRadius:"50%",background:C.red,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:900,cursor:"pointer"}}>×</div>}</div>;})}
          </div>
          <div style={{fontSize:8,color:C.faint,textAlign:"center",marginTop:3}}>Dashed line = paper center (half-page) · Drag blocks to reposition · Preview = Legal size (8.5″×14″)</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SWITCH PROFILE MODAL
══════════════════════════════════════════════════════ */
function SwitchProfileModal({accounts,currentUser,onSwitch,onClose}){
  const [selected,setSelected]=useState(null);
  const [pw,setPw]=useState("");
  const [showPw,setShowPw]=useState(false);
  const [error,setError]=useState("");

  const others=accounts.filter(a=>a.id!==currentUser.id);

  const handleSwitch=()=>{
    if(!selected)return;
    if(selected.password!==pw){setError("Incorrect password.");return;}
    onSwitch(selected);
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:1000,
      display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif"}}>
      <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:400,
        boxShadow:"0 24px 60px rgba(0,0,0,.3)",overflow:"hidden"}}>

        {/* Header */}
        <div style={{background:C.primary,color:"#fff",padding:"16px 20px",
          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:700,fontSize:15}}>⇄ Switch Profile</div>
            <div style={{fontSize:11,opacity:.7,marginTop:2}}>Select a profile and enter its password</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",
            color:"#fff",borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:14,
            display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>✕</button>
        </div>

        <div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>

          {/* Profile list */}
          {others.length===0&&(
            <div style={{textAlign:"center",padding:20,color:C.muted,fontSize:12}}>
              No other accounts available.
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {others.map(a=>{
              const roleColor={Admin:"#92400e",Staff:"#1e40af",Viewer:"#166534"}[a.role]||C.muted;
              const roleBg={Admin:"#fef3c7",Staff:"#dbeafe",Viewer:"#f0fdf4"}[a.role]||"#f3f4f6";
              const active=selected?.id===a.id;
              return(
                <div key={a.id} onClick={()=>{setSelected(a);setPw("");setError("");}}
                  style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",
                    borderRadius:8,cursor:"pointer",border:`2px solid ${active?C.accent:C.border}`,
                    background:active?C.accentLight:C.surface,transition:"all .12s"}}
                  onMouseEnter={e=>{if(!active)e.currentTarget.style.background="#f0f4ff";}}
                  onMouseLeave={e=>{if(!active)e.currentTarget.style.background=C.surface;}}>
                  <div style={{width:38,height:38,borderRadius:"50%",
                    background:active?C.accent:"#e0e7ef",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:16,flexShrink:0}}>
                    👤
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13,color:C.text}}>{a.name}</div>
                    <div style={{fontSize:11,color:C.muted,fontFamily:"monospace"}}>{a.username}</div>
                  </div>
                  <span style={{padding:"2px 8px",borderRadius:8,fontSize:10,fontWeight:700,
                    background:roleBg,color:roleColor}}>{a.role}</span>
                  {active&&<span style={{fontSize:14,color:C.accent}}>✓</span>}
                </div>
              );
            })}
          </div>

          {/* Password entry — only shown when a profile is selected */}
          {selected&&(
            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14,display:"flex",flexDirection:"column",gap:10}}>
              <div style={{fontSize:12,color:C.muted}}>
                Enter password for <b style={{color:C.text}}>{selected.name}</b>:
              </div>
              {error&&(
                <div style={{background:C.redLight,border:"1px solid #fecaca",borderRadius:6,
                  padding:"6px 10px",fontSize:12,color:C.red}}>⚠ {error}</div>
              )}
              <div style={{position:"relative"}}>
                <input type={showPw?"text":"password"} value={pw}
                  onChange={e=>{setPw(e.target.value);setError("");}}
                  onKeyDown={e=>e.key==="Enter"&&handleSwitch()}
                  style={inp({width:"100%",paddingRight:36})}
                  placeholder="Password…" autoFocus/>
                <button onClick={()=>setShowPw(v=>!v)}
                  style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",
                    background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.muted,padding:0}}>
                  {showPw?"🙈":"👁"}
                </button>
              </div>
              <button onClick={handleSwitch}
                style={{...Btn("primary"),width:"100%",height:36,justifyContent:"center",fontSize:13}}>
                Switch to {selected.name} →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   BARCODE SYSTEM v2
   - Short serial number (e.g. "BC-48291") as the visible code
   - Stored map: serialNo → {patientId, sections:{sectionId:[testIds]}}
   - Multi-section support: one barcode → many sections, each as a tab
   - Print via Electron-safe iframe approach
══════════════════════════════════════════════════════ */

// ── Generate a short serial: "BC-XXXXX" (5 random digits)
function genSerial(){
  const n=Math.floor(10000+Math.random()*90000);
  return "BC-"+n;
}

// ── Barcode store in localStorage: serialNo → order object
function bcLoad(){
  try{return JSON.parse(localStorage.getItem("lims_barcodes")||"{}");}catch{return {};}
}
function bcSave(data){
  try{localStorage.setItem("lims_barcodes",JSON.stringify(data));}catch{}
}

// ── Code128B encoder
function encodeCode128B(data){
  const CODE128_B={
    " ":0,"!":1,'"':2,"#":3,"$":4,"%":5,"&":6,"'":7,"(":8,")":9,
    "*":10,"+":11,",":12,"-":13,".":14,"/":15,"0":16,"1":17,"2":18,"3":19,
    "4":20,"5":21,"6":22,"7":23,"8":24,"9":25,":":26,";":27,"<":28,"=":29,
    ">":30,"?":31,"@":32,"A":33,"B":34,"C":35,"D":36,"E":37,"F":38,"G":39,
    "H":40,"I":41,"J":42,"K":43,"L":44,"M":45,"N":46,"O":47,"P":48,"Q":49,
    "R":50,"S":51,"T":52,"U":53,"V":54,"W":55,"X":56,"Y":57,"Z":58,"[":59,
    "\\":60,"]":61,"^":62,"_":63,"`":64,"a":65,"b":66,"c":67,"d":68,"e":69,
    "f":70,"g":71,"h":72,"i":73,"j":74,"k":75,"l":76,"m":77,"n":78,"o":79,
    "p":80,"q":81,"r":82,"s":83,"t":84,"u":85,"v":86,"w":87,"x":88,"y":89,
    "z":90,"{":91,"|":92,"}":93,"~":94
  };
  const PATTERNS=[
    "11011001100","11001101100","11001100110","10010011000","10010001100",
    "10001001100","10011001000","10011000100","10001100100","11001001000",
    "11001000100","11000100100","10110011100","10011011100","10011001110",
    "10111001100","10011101100","10011100110","11001110010","11001011100",
    "11001001110","11011100100","11001110100","11101101110","11101001100",
    "11100101100","11100100110","11101100100","11100110100","11100110010",
    "11011011000","11011000110","11000110110","10100011000","10001011000",
    "10001000110","10110001000","10001101000","10001100010","11010001000",
    "11000101000","11000100010","10110111000","10110001110","10001101110",
    "10111011000","10111000110","10001110110","11101110110","11010001110",
    "11000101110","11011101000","11011100010","11011101110","11101011000",
    "11101000110","11100010110","11101101000","11101100010","11100011010",
    "11101111010","11001000010","11110001010","10100110000","10100001100",
    "10010110000","10010000110","10000101100","10000100110","10110100000",
    "10110000100","10011010000","10011000010","10000110100","10000110010",
    "11000010010","11001010000","11110111010","11000010100","10001111010",
    "10100111100","10010111100","10010011110","10111100100","10011110100",
    "10011110010","11110100100","11110010100","11110010010","11011011110",
    "11011110110","11110110110","10101111000","10100011110","10001011110",
    "10111101000","10111100010","11110101000","11110100010","10111011110",
    "10111101110","11101011110","11110101110","11010000100","11010010000",
    "11010011100","1100011101011"
  ];
  const START_B=104,STOP=106;
  const vals=[START_B];
  let checksum=START_B;
  for(let i=0;i<data.length;i++){
    const v=CODE128_B[data[i]];
    if(v===undefined)continue;
    vals.push(v);
    checksum+=(v*(i+1));
  }
  vals.push(checksum%103);
  vals.push(STOP);
  let bars="";
  vals.forEach(v=>{bars+=PATTERNS[v]||"";});
  return "0000000000"+bars+"0000000000";
}

function drawBarcode(canvas,text){
  const bars=encodeCode128B(text);
  const barW=2.2;
  const bH=64;
  const padX=12;
  const totalW=Math.ceil(bars.length*barW)+padX*2;
  const totalH=bH+8;
  canvas.width=totalW;
  canvas.height=totalH;
  const ctx=canvas.getContext("2d");
  ctx.fillStyle="#ffffff";
  ctx.fillRect(0,0,totalW,totalH);
  ctx.fillStyle="#000000";
  for(let i=0;i<bars.length;i++){
    if(bars[i]==="1") ctx.fillRect(padX+Math.floor(i*barW),4,Math.ceil(barW),bH);
  }
}

// ── Print a barcode label using an invisible iframe (Electron-safe)
async function printBarcodeLabel({serial,patientName,sections,sectionDefs,testMap,canvasDataUrl}){
  // Build section+test summary lines
  const secLines=Object.entries(sections).map(([secId,tids])=>{
    const sd=sectionDefs.find(s=>s.id===secId);
    const names=tids.map(id=>{
      const allT=(testMap[secId]||[]).flatMap(g=>g.tests);
      return allT.find(t=>t.id===id)?.name||id;
    });
    return `<div class="sec"><strong>${sd?.label||secId}:</strong> ${names.join(", ")}</div>`;
  }).join("");

  const html=`<!DOCTYPE html><html><head>
<title>Lab Order ${serial}</title>
<style>
  *{box-sizing:border-box;}
  body{font-family:'Segoe UI',sans-serif;margin:0;padding:0;background:#fff;}
  .label{display:inline-block;border:1.5px solid #ccc;border-radius:8px;
    padding:12px 16px;text-align:center;min-width:260px;max-width:340px;}
  .serial{font-size:22px;font-weight:800;color:#0f2d4a;letter-spacing:2px;margin-bottom:2px;}
  .patient{font-size:13px;font-weight:700;color:#333;margin-bottom:2px;}
  .date{font-size:10px;color:#888;margin-bottom:6px;}
  img.bc{display:block;margin:6px auto;max-width:100%;}
  .serial-text{font-size:11px;font-family:monospace;color:#555;letter-spacing:3px;margin:2px 0 8px;}
  .sec{font-size:10px;color:#444;text-align:left;margin-bottom:3px;}
  .sec strong{color:#0f2d4a;}
  @media print{
    body{padding:4mm;}
    button{display:none!important;}
    .label{border:1px solid #aaa;}
  }
</style>
</head><body>
<div class="label">
  <div class="serial">${serial}</div>
  <div class="patient">${patientName}</div>
  <div class="date">${new Date().toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}</div>
  <img class="bc" src="${canvasDataUrl}" alt="barcode"/>
  <div class="serial-text">${serial}</div>
  ${secLines}
</div>
<br/>
<button onclick="window.print()" style="margin:12px;padding:8px 24px;background:#0f2d4a;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;">🖨 Print Label</button>
<script>setTimeout(()=>window.print(),400);<\/script>
</body></html>`;

  // Try Electron's print-label API first (uses selected thermal printer), fall back to iframe
  if(window.electronAPI?.printLabel){
    // Get saved label printer preference
    const prefs=window.electronAPI.getPrinterPrefs?await window.electronAPI.getPrinterPrefs():{};
    const labelPrinter=prefs?.labelPrinter||"";
    window.electronAPI.printLabel(html,labelPrinter);
    return;
  }
  try{
    let iframe=document.getElementById("__bc_print_frame__");
    if(!iframe){
      iframe=document.createElement("iframe");
      iframe.id="__bc_print_frame__";
      iframe.style.cssText="position:fixed;top:-9999px;left:-9999px;width:400px;height:600px;border:none;";
      document.body.appendChild(iframe);
    }
    const doc=iframe.contentDocument||iframe.contentWindow.document;
    doc.open();doc.write(html);doc.close();
    setTimeout(()=>{
      try{iframe.contentWindow.print();}
      catch{
        // If iframe print blocked, try window.open
        const w=window.open("","_blank","width=420,height=500");
        if(w){w.document.write(html);w.document.close();}
      }
    },500);
  }catch{
    const w=window.open("","_blank","width=420,height=500");
    if(w){w.document.write(html);w.document.close();}
  }
}

/* ══ BarcodeView ══ */
function BarcodeView({patients,tests,sections,onNav}){
  const [activeTab,setActiveTab]=useState("generate");

  // ── GENERATE state
  const [patientId,setPatientId]=useState("");
  const [selSections,setSelSections]=useState({}); // {secId: {testId: bool}}
  const [activeSec,setActiveSec]=useState(""); // which section tab is open in test picker
  const [generated,setGenerated]=useState(null); // {serial, canvasDataUrl} or null
  const canvasRef=useRef(null);

  // ── SCAN state
  const [scanInput,setScanInput]=useState("");
  const [scanResult,setScanResult]=useState(null);
  const [scanError,setScanError]=useState("");
  const [scanActiveTab,setScanActiveTab]=useState(""); // section tab in scan result
  const scanRef=useRef(null);

  const pat=patients.find(p=>p.id===patientId);

  // Which sections have been added to the order (regardless of whether tests are selected yet)
  const addedSectionIds=Object.keys(selSections);

  // Which sections have at least one test selected (for validation)
  const selectedSectionIds=addedSectionIds.filter(sid=>
    Object.values(selSections[sid]||{}).some(Boolean)
  );

  const totalSelectedTests=addedSectionIds.reduce((sum,sid)=>
    sum+Object.values(selSections[sid]||{}).filter(Boolean).length,0
  );

  const toggleSection=(sid)=>{
    setSelSections(prev=>{
      if(prev[sid]!==undefined){
        // Remove section
        const next={...prev};
        delete next[sid];
        const remaining=Object.keys(next);
        setActiveSec(remaining[0]||"");
        return next;
      } else {
        // Add section — auto-select ALL tests for urinalysis & fecalysis
        const autoAll=sid==="urinalysis"||sid==="fecalysis";
        let testSel={};
        if(autoAll){
          const allT=(tests[sid]||[]).flatMap(g=>g.tests);
          allT.forEach(t=>{testSel[t.id]=true;});
        }
        setActiveSec(sid);
        return {...prev,[sid]:testSel};
      }
    });
    setGenerated(null);
  };

  const toggleTest=(sid,tid)=>{
    setSelSections(prev=>({
      ...prev,
      [sid]:{...prev[sid],[tid]:!prev[sid]?.[tid]}
    }));
    setGenerated(null);
  };

  const selectAllTests=(sid)=>{
    const allT=(tests[sid]||[]).flatMap(g=>g.tests);
    const t={};allT.forEach(x=>{t[x.id]=true;});
    setSelSections(prev=>({...prev,[sid]:t}));
    setGenerated(null);
  };

  const clearAllTests=(sid)=>{
    setSelSections(prev=>({...prev,[sid]:{}}));
    setGenerated(null);
  };

  const handleGenerate=useCallback(()=>{
    if(!patientId)return alert("Please select a patient.");
    if(!addedSectionIds.length)return alert("Please add at least one lab section.");
    if(!totalSelectedTests)return alert("Please select at least one test.");
    const serial=genSerial();
    // Save to barcode store
    const store=bcLoad();
    const secData={};
    addedSectionIds.forEach(sid=>{
      const tids=Object.keys(selSections[sid]||{}).filter(k=>selSections[sid][k]);
      if(tids.length>0) secData[sid]=tids;
    });
    store[serial]={patientId,sections:secData,createdAt:new Date().toISOString()};
    bcSave(store);
    // Draw barcode
    setTimeout(()=>{
      if(canvasRef.current){
        drawBarcode(canvasRef.current,serial);
        const dataUrl=canvasRef.current.toDataURL("image/png");
        setGenerated({serial,canvasDataUrl:dataUrl,sections:secData});
      }
    },30);
  },[patientId,selSections,addedSectionIds,totalSelectedTests]);

  const handlePrint=()=>{
    if(!generated||!pat)return;
    printBarcodeLabel({
      serial:generated.serial,
      patientName:pat.name,
      sections:generated.sections,
      sectionDefs:sections,
      testMap:tests,
      canvasDataUrl:generated.canvasDataUrl
    });
  };

  // ── SCAN handlers
  const handleScan=()=>{
    const raw=(scanInput||"").trim().toUpperCase();
    if(!raw){setScanError("Please enter or scan a barcode value.");return;}
    const store=bcLoad();
    const order=store[raw];
    if(!order){setScanError(`Serial "${raw}" not found. Make sure it was generated on this device.`);return;}
    const p=patients.find(x=>x.id===order.patientId);
    if(!p){setScanError("Patient not found — they may have been deleted.");return;}
    const secs=Object.keys(order.sections).map(sid=>({
      section:sections.find(s=>s.id===sid)||{id:sid,label:sid,icon:"🔬"},
      testIds:order.sections[sid]||[]
    })).filter(x=>x.section);
    if(!secs.length){setScanError("No valid sections found in this order.");return;}
    setScanError("");
    setScanResult({serial:raw,patient:p,secs});
    setScanActiveTab(secs[0]?.section.id||"");
  };

  const handleNavigateSection=(sid,tids)=>{
    if(!scanResult)return;
    onNav(`lab:${sid}`,{patientId:scanResult.patient.id,section:sid,testIds:tids});
  };

  useEffect(()=>{
    if(activeTab==="scan"&&scanRef.current) scanRef.current.focus();
  },[activeTab]);

  // Active section tests for the picker
  const activeSecGroups=activeSec?(tests[activeSec]||[]):[];
  const activeSecSelections=selSections[activeSec]||{};
  const activeSecCount=Object.values(activeSecSelections).filter(Boolean).length;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16,maxWidth:960}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:44,height:44,borderRadius:10,background:"#0d7bbd22",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>▦</div>
        <div>
          <div style={{fontWeight:700,fontSize:18,color:C.primary}}>Barcode System</div>
          <div style={{fontSize:11,color:C.muted}}>
            Generate a short barcode per lab order · Scan to open tabbed result entry per section
          </div>
        </div>
      </div>

      {/* Main tabs */}
      <div style={{display:"flex",gap:0,background:C.surface,borderRadius:8,
        border:`1px solid ${C.border}`,padding:3,width:"fit-content"}}>
        {[{id:"generate",icon:"🖨",label:"Generate Barcode"},{id:"scan",icon:"📷",label:"Scan Barcode"}].map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            style={{padding:"7px 20px",borderRadius:6,border:"none",cursor:"pointer",
              fontFamily:"inherit",fontSize:12.5,fontWeight:600,
              background:activeTab===t.id?C.primary:"transparent",
              color:activeTab===t.id?"#fff":C.muted,transition:"all .15s"}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ══ GENERATE TAB ══ */}
      {activeTab==="generate"&&(
        <div style={{display:"flex",gap:16,flexWrap:"wrap",alignItems:"flex-start"}}>

          {/* Left column: patient + section picker + test picker */}
          <div style={{flex:"1 1 340px",display:"flex",flexDirection:"column",gap:12}}>

            {/* Patient */}
            <Card>
              <CardHead title="Patient" icon="👤"/>
              <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
                <PatientCombo patients={patients} value={patientId}
                  onChange={v=>{setPatientId(v);setGenerated(null);}}/>
                {pat&&(
                  <div style={{background:C.accentLight,borderRadius:7,padding:"8px 12px",
                    fontSize:12,color:C.accent,fontWeight:600,display:"flex",gap:12,flexWrap:"wrap"}}>
                    <span>👤 {pat.name}</span>
                    {pat.dob&&<span>· {calcAge(pat.dob)} yrs</span>}
                    {pat.gender&&<span>· {pat.gender}</span>}
                  </div>
                )}
              </div>
            </Card>

            {/* Section selector */}
            <Card>
              <CardHead title="Lab Sections" icon="🔬"/>
              <div style={{padding:"12px 16px"}}>
                <div style={{fontSize:11,color:C.muted,marginBottom:10}}>
                  Click sections to add them to this order. Selected sections appear as tabs below.
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {sections.map(s=>{
                    const isAdded=selSections[s.id]!==undefined;
                    const cnt=isAdded?Object.values(selSections[s.id]||{}).filter(Boolean).length:0;
                    return(
                      <button key={s.id}
                        onClick={()=>toggleSection(s.id)}
                        style={{padding:"6px 12px",borderRadius:20,border:"none",cursor:"pointer",
                          fontFamily:"inherit",fontSize:11.5,fontWeight:600,
                          background:isAdded?(s.color+"22"):"#f3f4f6",
                          color:isAdded?(s.color||C.primary):C.muted,
                          outline:isAdded?`2px solid ${s.color||C.accent}`:"2px solid transparent",
                          transition:"all .15s",display:"flex",alignItems:"center",gap:5}}>
                        {s.icon} {s.label}
                        {isAdded&&<span style={{background:s.color||C.accent,color:"#fff",
                          borderRadius:"50%",width:16,height:16,fontSize:10,
                          display:"inline-flex",alignItems:"center",justifyContent:"center",
                          fontWeight:700}}>{cnt}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Test picker — tabs per added section */}
            {addedSectionIds.length>0&&(
              <Card>
                <CardHead title="Select Tests" icon="✅"/>
                <div style={{padding:"0 0 12px"}}>
                  {/* Section tabs */}
                  <div style={{display:"flex",gap:0,borderBottom:`1px solid ${C.border}`,
                    overflowX:"auto",padding:"0 12px"}}>
                    {addedSectionIds.map(sid=>{
                      const sd=sections.find(s=>s.id===sid);
                      const cnt=Object.values(selSections[sid]||{}).filter(Boolean).length;
                      const isActive=activeSec===sid;
                      return(
                        <button key={sid} onClick={()=>setActiveSec(sid)}
                          style={{padding:"8px 14px",border:"none",cursor:"pointer",fontFamily:"inherit",
                            fontSize:12,fontWeight:600,whiteSpace:"nowrap",flexShrink:0,
                            background:"transparent",
                            color:isActive?(sd?.color||C.accent):C.muted,
                            borderBottom:isActive?`2.5px solid ${sd?.color||C.accent}`:"2.5px solid transparent",
                            transition:"all .15s"}}>
                          {sd?.icon} {sd?.label}
                          {cnt>0&&<span style={{marginLeft:5,background:sd?.color||C.accent,
                            color:"#fff",borderRadius:10,padding:"0 6px",fontSize:10,fontWeight:700}}>
                            {cnt}
                          </span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Test list for active section */}
                  {activeSec&&(
                    <div style={{padding:"10px 16px 0"}}>
                      {(activeSec==="urinalysis"||activeSec==="fecalysis")&&(
                        <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:6,
                          padding:"6px 12px",fontSize:11,color:"#15803d",fontWeight:600,marginBottom:8}}>
                          ✓ All tests auto-included for {activeSec==="urinalysis"?"Urinalysis":"Fecalysis"}
                        </div>
                      )}
                      <div style={{display:"flex",justifyContent:"space-between",
                        alignItems:"center",marginBottom:8}}>
                        <span style={{fontSize:11,color:C.muted,fontWeight:600}}>
                          {activeSecCount} test{activeSecCount!==1?"s":""} selected
                        </span>
                        <div style={{display:"flex",gap:6}}>
                          <button style={Btn("ghost",{height:23,fontSize:10,padding:"0 8px"})}
                            onClick={()=>selectAllTests(activeSec)}>All</button>
                          <button style={Btn("ghost",{height:23,fontSize:10,padding:"0 8px"})}
                            onClick={()=>clearAllTests(activeSec)}>None</button>
                        </div>
                      </div>
                      <div style={{border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden",
                        maxHeight:280,overflowY:"auto"}}>
                        {activeSecGroups.map((grp,gi)=>(
                          <div key={gi}>
                            <div style={{padding:"5px 12px",background:C.surface,
                              borderBottom:`1px solid ${C.border}`,
                              fontSize:10,fontWeight:700,color:C.primary,
                              textTransform:"uppercase",letterSpacing:.8}}>
                              {grp.group}
                            </div>
                            {grp.tests.map(t=>(
                              <div key={t.id} onClick={()=>toggleTest(activeSec,t.id)}
                                style={{display:"flex",alignItems:"center",gap:10,
                                  padding:"6px 12px",cursor:"pointer",
                                  borderBottom:`1px solid ${C.border}`,
                                  background:activeSecSelections[t.id]?C.accentLight:"#fff",
                                  transition:"background .1s"}}>
                                <input type="checkbox" readOnly checked={!!activeSecSelections[t.id]}
                                  style={{accentColor:C.accent,width:14,height:14,flexShrink:0}}/>
                                <span style={{fontSize:12.5,color:C.text,flex:1}}>{t.name}</span>
                                {t.unit&&<span style={{fontSize:10,color:C.muted}}>{t.unit}</span>}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <button style={{...Btn("primary"),justifyContent:"center",height:38,fontSize:13}}
              onClick={handleGenerate}>
              ▦ Generate Barcode ({totalSelectedTests} test{totalSelectedTests!==1?"s":""})
            </button>
          </div>

          {/* Right column: preview + guide */}
          <div style={{flex:"0 1 320px",display:"flex",flexDirection:"column",gap:12}}>
            <Card>
              <CardHead title="Barcode Label Preview" icon="🔲"/>
              <div style={{padding:20,display:"flex",flexDirection:"column",
                alignItems:"center",gap:12,minHeight:240}}>
                {!generated?(
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",
                    gap:10,padding:30,color:C.faint,textAlign:"center"}}>
                    <div style={{fontSize:52,opacity:.3}}>▦</div>
                    <div style={{fontSize:12}}>Configure your order and click Generate</div>
                  </div>
                ):(
                  <>
                    {/* Serial number prominent display */}
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:28,fontWeight:900,letterSpacing:4,color:C.primary,
                        fontFamily:"monospace"}}>
                        {generated.serial}
                      </div>
                      {pat&&<div style={{fontSize:13,color:C.muted,marginTop:2}}>{pat.name}</div>}
                    </div>

                    {/* Barcode canvas */}
                    <div style={{border:`1.5px solid ${C.border}`,borderRadius:8,
                      padding:"12px 8px",background:"#fff",textAlign:"center",width:"100%"}}>
                      <canvas ref={canvasRef} style={{display:"block",margin:"0 auto",maxWidth:"100%"}}/>
                      <div style={{fontSize:11,fontFamily:"monospace",letterSpacing:3,
                        color:"#444",marginTop:6}}>{generated.serial}</div>
                    </div>

                    {/* Section summary */}
                    <div style={{width:"100%"}}>
                      {Object.entries(generated.sections).map(([sid,tids])=>{
                        const sd=sections.find(s=>s.id===sid);
                        const allT=(tests[sid]||[]).flatMap(g=>g.tests);
                        return(
                          <div key={sid} style={{marginBottom:6,padding:"6px 10px",
                            background:C.surface,borderRadius:6,
                            border:`1px solid ${C.border}`}}>
                            <div style={{fontSize:11,fontWeight:700,color:sd?.color||C.primary}}>
                              {sd?.icon} {sd?.label}
                            </div>
                            <div style={{fontSize:10,color:C.muted,marginTop:2}}>
                              {tids.map(id=>allT.find(t=>t.id===id)?.name||id).join(" · ")}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{display:"flex",gap:10,width:"100%"}}>
                      <button style={{...Btn("primary"),justifyContent:"center",flex:1}}
                        onClick={handlePrint}>
                        🖨 Print Label
                      </button>
                      <button style={{...Btn("ghost"),justifyContent:"center"}}
                        onClick={()=>{setGenerated(null);setPatientId("");setSelSections({});setActiveSec("");}}>
                        🔄 New
                      </button>
                    </div>

                    <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",
                      borderRadius:8,padding:"8px 12px",width:"100%",
                      fontSize:11,color:"#15803d",textAlign:"center"}}>
                      ✅ Serial saved. Scan <strong>{generated.serial}</strong> in the Scan tab to load the order.
                    </div>
                  </>
                )}
              </div>
            </Card>

            <Card>
              <div style={{padding:"12px 16px"}}>
                <div style={{fontWeight:700,fontSize:12,color:C.primary,marginBottom:8}}>📋 Workflow</div>
                {[
                  ["1️⃣","Select patient, add one or more lab sections"],
                  ["2️⃣","In each section tab, tick the ordered tests"],
                  ["3️⃣","Generate → Print the label (shows serial like BC-48291)"],
                  ["4️⃣","Attach label to the sample tube/container"],
                  ["5️⃣","Scan tab: scan the barcode to load the order"],
                  ["6️⃣","Each section opens as its own tab for result entry"],
                ].map(([n,t])=>(
                  <div key={n} style={{display:"flex",gap:8,marginBottom:6}}>
                    <span style={{fontSize:14,flexShrink:0}}>{n}</span>
                    <span style={{fontSize:11,color:C.muted,lineHeight:1.5}}>{t}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ══ SCAN TAB ══ */}
      {activeTab==="scan"&&(
        <div style={{display:"flex",gap:16,flexWrap:"wrap",alignItems:"flex-start"}}>
          <div style={{flex:"1 1 380px",display:"flex",flexDirection:"column",gap:12}}>
            <Card>
              <CardHead title="Scan or Enter Barcode" icon="📷"/>
              <div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
                <div style={{background:C.accentLight,border:`1.5px solid ${C.accentMid}`,
                  borderRadius:8,padding:"10px 14px",fontSize:12,color:C.accent}}>
                  🔌 <strong>USB Scanner:</strong> Click the field, then scan. The scanner sends the serial number + Enter automatically.
                </div>

                <Field label="Serial Number / Barcode">
                  <div style={{display:"flex",gap:8}}>
                    <input ref={scanRef}
                      value={scanInput}
                      onChange={e=>{setScanInput(e.target.value.toUpperCase());setScanResult(null);setScanError("");}}
                      onKeyDown={e=>{if(e.key==="Enter")handleScan();}}
                      placeholder="e.g. BC-48291"
                      style={{...inp(),flex:1,fontFamily:"monospace",fontSize:14,
                        letterSpacing:2,fontWeight:700}}
                      autoFocus/>
                    <button style={Btn("accent")} onClick={handleScan}>Load</button>
                  </div>
                </Field>

                {scanError&&(
                  <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:8,
                    padding:"10px 14px",fontSize:12,color:C.red}}>
                    ⚠️ {scanError}
                  </div>
                )}

                {scanResult&&(
                  <div style={{border:`1.5px solid #86efac`,borderRadius:10,overflow:"hidden"}}>
                    {/* Patient info */}
                    <div style={{background:"#f0fdf4",padding:"10px 16px",
                      display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:18}}>✅</span>
                      <div>
                        <div style={{fontWeight:700,fontSize:13,color:"#15803d"}}>
                          {scanResult.serial} — {scanResult.patient.name}
                        </div>
                        <div style={{fontSize:11,color:C.muted}}>
                          {scanResult.secs.length} section{scanResult.secs.length!==1?"s":""} ordered
                        </div>
                      </div>
                    </div>

                    {/* Section tabs */}
                    <div style={{borderBottom:`1px solid ${C.border}`,
                      display:"flex",overflowX:"auto",background:C.surface}}>
                      {scanResult.secs.map(({section,testIds})=>(
                        <button key={section.id} onClick={()=>setScanActiveTab(section.id)}
                          style={{padding:"8px 16px",border:"none",cursor:"pointer",
                            fontFamily:"inherit",fontSize:12,fontWeight:600,whiteSpace:"nowrap",
                            background:"transparent",
                            color:scanActiveTab===section.id?(section.color||C.accent):C.muted,
                            borderBottom:scanActiveTab===section.id
                              ?`2.5px solid ${section.color||C.accent}`:"2.5px solid transparent",
                            transition:"color .15s"}}>
                          {section.icon} {section.label}
                          <span style={{marginLeft:5,background:section.color||C.accent,color:"#fff",
                            borderRadius:10,padding:"0 5px",fontSize:10,fontWeight:700}}>
                            {testIds.length}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Active section detail */}
                    {scanResult.secs.map(({section,testIds})=>{
                      if(scanActiveTab!==section.id)return null;
                      const allT=(tests[section.id]||[]).flatMap(g=>g.tests);
                      return(
                        <div key={section.id} style={{padding:16,display:"flex",
                          flexDirection:"column",gap:10}}>
                          <div style={{fontSize:12,fontWeight:700,color:section.color||C.primary}}>
                            {section.icon} {section.label} — Ordered Tests
                          </div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                            {testIds.map(id=>{
                              const tDef=allT.find(t=>t.id===id);
                              return(
                                <span key={id} style={{background:C.accentLight,color:C.accent,
                                  borderRadius:6,padding:"3px 10px",fontSize:11.5,fontWeight:600}}>
                                  {tDef?.name||id}
                                </span>
                              );
                            })}
                          </div>
                          <button
                            onClick={()=>handleNavigateSection(section.id,testIds)}
                            style={{...Btn("primary"),justifyContent:"center",height:36,
                              background:section.color||C.primary}}>
                            Open {section.label} Result Entry →
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button style={{...Btn("ghost"),justifyContent:"center"}}
                  onClick={()=>{setScanInput("");setScanResult(null);setScanError("");}}>
                  🔄 Clear
                </button>
              </div>
            </Card>
          </div>

          {/* Instructions */}
          <div style={{flex:"0 1 260px",display:"flex",flexDirection:"column",gap:12}}>
            <Card>
              <div style={{padding:"14px 16px"}}>
                <div style={{fontWeight:700,fontSize:12,color:C.primary,marginBottom:10}}>
                  📋 How Scanning Works
                </div>
                {[
                  {h:"USB Scanner",b:"Plug in any USB barcode scanner. Click the input field, then scan the printed label."},
                  {h:"Serial Numbers",b:'Barcodes encode a short serial like "BC-48291" — not raw patient data.'},
                  {h:"Multiple Sections",b:"Each lab section ordered appears as its own tab. Click the tab to see the tests."},
                  {h:"Open Entry Form",b:"Click the button inside a tab to open that section's result form with patient and tests pre-loaded."},
                ].map(({h,b})=>(
                  <div key={h} style={{marginBottom:10,paddingBottom:10,borderBottom:`1px solid ${C.border}`}}>
                    <div style={{fontWeight:700,fontSize:11,color:C.primary,marginBottom:2}}>{h}</div>
                    <div style={{fontSize:11,color:C.muted,lineHeight:1.5}}>{b}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
