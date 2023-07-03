export const BASE_URL = "http://localhost:3000"
// process.env.NODE_ENV === "production"
//   ? "https://www.nozee.xyz"
//   : "http://localhost:3000"
export const uncompressedZkey =
  "https://zkjwt-zkey-chunks.s3.amazonaws.com/jwt_single-real.zkey"
export const compressedZkey =
  "https://zkjwt-zkey-chunks.s3.us-west-2.amazonaws.com/jwt_timestamp.zkey.gz"
export const isCompressed = true
export const localZkeyKey = "jwt.zkey"

export const openAiPubKey = [
  "1039819274958841503552777425237411969",
  "2393925418941457468536305535389088567",
  "513505235307821578406185944870803528",
  "31648688809132041103725691608565945",
  "1118227280248002501343932784260195348",
  "1460752189656646928843376724380610733",
  "2494690879775849992239868627264129920",
  "499770848099786006855805824914661444",
  "117952129670880907578696311220260862",
  "594599095806595023021313781486031656",
  "1954215709028388479536967672374066621",
  "275858127917207716435784616531223795",
  "2192832134592444363563023272016397664",
  "1951765503135207318741689711604628857",
  "679054217888353607009053133437382225",
  "831007028401303788228965296099949363",
  "4456647917934998006260668783660427",
]

export const jwtClientPubKey = [
  "1134853360576537932466234277798526027",
  "847428221109501915745358721395067830",
  "1223870068223419616411578217633798196",
  "2166485855327005263829453472664955959",
  "542515445105220596810079680223251413",
  "934370490393737450306838720699654909",
  "1749964657466129289014201449090639162",
  "2165947882336062552511050465766574651",
  "2370034287529430412528838399469551452",
  "271455047122278879112452881225249570",
  "2577679506816969535259731741152046238",
  "2048207670466684390681347240512062868",
  "2465360690851201982569333981189328253",
  "2256134874583651311047273297653249338",
  "1518331239341111088254956196568674978",
  "1911262191835912773951479041257252065",
  "3125544198420923698981052029175777",
]

export const vkey = {
  protocol: "groth16",
  curve: "bn128",
  nPublic: 48,
  vk_alpha_1: [
    "20491192805390485299153009773594534940189261866228447918068658471970481763042",
    "9383485363053290200918347156157836566562967994039712273449902621266178545958",
    "1",
  ],
  vk_beta_2: [
    [
      "6375614351688725206403948262868962793625744043794305715222011528459656738731",
      "4252822878758300859123897981450591353533073413197771768651442665752259397132",
    ],
    [
      "10505242626370262277552901082094356697409835680220590971873171140371331206856",
      "21847035105528745403288232691147584728191162732299865338377159692350059136679",
    ],
    ["1", "0"],
  ],
  vk_gamma_2: [
    [
      "10857046999023057135944570762232829481370756359578518086990519993285655852781",
      "11559732032986387107991004021392285783925812861821192530917403151452391805634",
    ],
    [
      "8495653923123431417604973247489272438418190587263600148770280649306958101930",
      "4082367875863433681332203403145435568316851327593401208105741076214120093531",
    ],
    ["1", "0"],
  ],
  vk_delta_2: [
    [
      "17237224482274224995166076321882841466281156092600101802841532347513422629396",
      "4835648955079222026656198166765608729104858565613626282635064688772572336095",
    ],
    [
      "12012581634867220949220887510121731425148050787351186134540068276591275006983",
      "19470693571854987206324774167265025917916781840656062849526183316744878911614",
    ],
    ["1", "0"],
  ],
  vk_alphabeta_12: [
    [
      [
        "2029413683389138792403550203267699914886160938906632433982220835551125967885",
        "21072700047562757817161031222997517981543347628379360635925549008442030252106",
      ],
      [
        "5940354580057074848093997050200682056184807770593307860589430076672439820312",
        "12156638873931618554171829126792193045421052652279363021382169897324752428276",
      ],
      [
        "7898200236362823042373859371574133993780991612861777490112507062703164551277",
        "7074218545237549455313236346927434013100842096812539264420499035217050630853",
      ],
    ],
    [
      [
        "7077479683546002997211712695946002074877511277312570035766170199895071832130",
        "10093483419865920389913245021038182291233451549023025229112148274109565435465",
      ],
      [
        "4595479056700221319381530156280926371456704509942304414423590385166031118820",
        "19831328484489333784475432780421641293929726139240675179672856274388269393268",
      ],
      [
        "11934129596455521040620786944827826205713621633706285934057045369193958244500",
        "8037395052364110730298837004334506829870972346962140206007064471173334027475",
      ],
    ],
  ],
  IC: [
    [
      "20051464613832018473613601632902798456881313277137296835590703978655949283329",
      "16090112617019933608926865831433240197753068770303965576646141973589354466399",
      "1",
    ],
    [
      "16594065687435924654865878625155651492359399509266735110731060373944030591396",
      "8777501682656180435191518167410071523955840263898184052454580517630956607464",
      "1",
    ],
    [
      "14286385436945299263338456187447638607380173098671601342364370551787298746506",
      "9607550463211609795008501885047820042747805398684347258147171141252895802791",
      "1",
    ],
    [
      "2655237033934732674266980291158039364255552187069061167190079808409780353807",
      "17454698445648660207432570750988839927261073252143454635063982835846885571920",
      "1",
    ],
    [
      "17606471961137793990334675813835439084121469428324804190290692897228856334231",
      "8494096185041901455714840198927875952578099442454730430086307127622198474497",
      "1",
    ],
    [
      "11774855955194766907577144625402407727713014562503765716333569307482736635073",
      "21226255923667511245459880146129864381655967035745564699131199715047610458210",
      "1",
    ],
    [
      "16247111992235412074550076122970002811067452566756017525999704777411636020544",
      "19189945066092223653893641525177754472296449269465478670079721488019663240918",
      "1",
    ],
    [
      "17633557047584648732639279618574500689357783540848711607769439109818718933877",
      "756395437726194665546234180527130377110806363690904305196048466347177389752",
      "1",
    ],
    [
      "6145056205678117730782260681499997473657490283229513926778414555978043486544",
      "10707296977886679288700757092363858516868125249626529949806850279472383381124",
      "1",
    ],
    [
      "4815782861729759656105798969328964075413228201767809315639790674961211725674",
      "9947423291903669439682253490172134232062015934911888411635280649760696934271",
      "1",
    ],
    [
      "8329111784876154298102315734112821057711348001372540239082447644779747371580",
      "5137362322333281616039484953977936568199083379008756006404978626474839769944",
      "1",
    ],
    [
      "20640848538307561025017582126011824412536340482344949046745111776387806827573",
      "12042609779614055635333438721954964730695926282092258548714492509908749880349",
      "1",
    ],
    [
      "5695097653020321006748944118712969260588725749465570592641778119403215233605",
      "16240597833258019538311295509882011818023534086245951061913923759787521148941",
      "1",
    ],
    [
      "5935256643766362514509190480643810712528429135344201470730666566006200104944",
      "6989634220744016616542628376982158269286357753144097452313999975069711871459",
      "1",
    ],
    [
      "20574350138836697695575278140686310933388056827198802628502764559727999160628",
      "4532442781497525142700037819544037378690403690948427826877821543488465330694",
      "1",
    ],
    [
      "8311329429416081767490306103180800442937592609933503337536476731631705367460",
      "12281349839511047388098030732696707309728127078281778891363717070622009636980",
      "1",
    ],
    [
      "11354537613494951931411463831291570154893601291172421176005539457252278767747",
      "6853704887474408986840712047136509395701666200980895886281758696747705892841",
      "1",
    ],
    [
      "2816264268285907328977080362526769182137353792378119048546050209932196774184",
      "13560115045568438255434928962489210612257676147183087494903977900989496668566",
      "1",
    ],
    [
      "15828752148913699453453947944720115533548743933867383377329256326827589863096",
      "12310803057659078956140035808413104000348233217026572818594519575691335080894",
      "1",
    ],
    [
      "17466829272695315868321017926119718582563557356421739884892228275551102638494",
      "5304158563583196073288422587099769168129339413242463812996754946091532044557",
      "1",
    ],
    [
      "9650440595855773755347442563220275756559453032538750693754532824674894742928",
      "7411556275045677180538357132624396463675600734654226240130503855884532408589",
      "1",
    ],
    [
      "2108311632598860687214971751436403342597330038045377476358758719922274522067",
      "5813341496590180323891247702369070622028267939326627757054650833090182309069",
      "1",
    ],
    [
      "5643690462683728452143354715472508830583517731127008705194227194222139340499",
      "6750460562596135294604840266344580842260650665182279404874788486115490582278",
      "1",
    ],
    [
      "9400134096429966315773273340091956309707757440861932276635970087706247367327",
      "14206405686055532100106996944787387747890228284895615883982559928630899486048",
      "1",
    ],
    [
      "16653802711372137194970244925504406633443742144127172078029477032036347179234",
      "17977812549979077980194834612479061873639360645327205400806607731051012136340",
      "1",
    ],
    [
      "3786784581308143142084597359779034285282421766148983270856025754792114291804",
      "18952166226218515857438320696216806070793831757388805409034119652663094087702",
      "1",
    ],
    [
      "14898743666218159787871353195490045412130907407532310801541792478819654074262",
      "18691424271331352444667161168327539301768488042931071467120061907531388821679",
      "1",
    ],
    [
      "14400531747369905272225360028633237483907176737657841107895133620680860192498",
      "17528340721884061166414346504331238590185572973608358336543098014524587821915",
      "1",
    ],
    [
      "20178770784780265524350732700816461212054993259400962406974990031813114986233",
      "11181014924486390465422873926914602829173930857302754200039266036897548138119",
      "1",
    ],
    [
      "4523922323556894588717116648510979667770721702476165321638387818025474062223",
      "17665243372249271342922658802416586465705703400559248387738414158274468570800",
      "1",
    ],
    [
      "3320328333717901043365495388160116059160222371389349458559536349179232117884",
      "1013630358328159509419719057170054172128766804255485826532625616211334757217",
      "1",
    ],
    [
      "2654011088141787046843274232114972795001629541976579441599155464475262590423",
      "17269311188399043466277225018324359524655272994294116564942103175000749627165",
      "1",
    ],
    [
      "4419704980933235637276356821887608135834736331288635796743540569908299877563",
      "19807584864084925497619841369152253562851633392007214845118054456634267898889",
      "1",
    ],
    [
      "221676072228297962153257541221769678795822670451600095929827726570286067016",
      "20675739863196909614124530901157113293252136611547621959035283009282779167355",
      "1",
    ],
    [
      "14685141917723657889085026260810093282567357819748191600207876659185918904133",
      "20612250083054587238328937276505702831400178506467703988422097752768861707038",
      "1",
    ],
    [
      "9507836445429096222504076402435790200611310342690132417988952807384851479523",
      "2780121248716134030989648290049674536342743543701168299162402391360481669906",
      "1",
    ],
    [
      "3545461205364236761714769111431947843777280714361044434104989575732208238898",
      "10785403459046557962515763006720932305034596308610222414812690657404085676938",
      "1",
    ],
    [
      "9232953808555129393556443960450953304547469533326332709616055390449973762490",
      "16656397039821840360877582320701933981720843729236435546887791901492687318673",
      "1",
    ],
    [
      "1700194950777379212680115965329060276021739914001135438238428050566810392149",
      "12375279976963197141774158460538301291174575563026846628227575040211759875503",
      "1",
    ],
    [
      "7627919916498174817757481556811581126282165769471123813322012392419373790751",
      "13031984877215392952557114131742937345402829371744745585727840392871218510241",
      "1",
    ],
    [
      "3502981144136220387923444356484307163027828205152804736118632503469913226441",
      "9771525273534407287930735228719817928822173516820706132693746150139634687127",
      "1",
    ],
    [
      "339433087758030381944557586328849786930464535948798077151658304741947058091",
      "8330626385959795254179847348685712765262705333836175243275850007433582924016",
      "1",
    ],
    [
      "16313484605049439753828233817226668606336203734444516654727361318262215386484",
      "10524644180955980612957107870814854592659955887049159859228580666485816879380",
      "1",
    ],
    [
      "968375776478640621266146700607948327111799980533614321454129944145921990980",
      "21028850972927344379345707941159675470252083211603334516151696751476427752109",
      "1",
    ],
    [
      "12172656527692494643443062646233847946899534333340121163032872675131410114759",
      "1912904585255049326716016019132514111624507703316814600771891988904794298825",
      "1",
    ],
    [
      "6569591543816784679163440029152935761943952306771099913325887254703816053712",
      "2471664623714728536803895109257718332839974662608641964879977716047584104772",
      "1",
    ],
    [
      "3097184249509683680110925104098728511337888281971900760933623105331118204387",
      "5471291820090258258474840996562928587255715982031040613282722496876803399711",
      "1",
    ],
    [
      "17013959490667406561941083445652700120230492883152742551337661239805605544139",
      "21740261757942444074674953393795853665820464720318553256839771926476573960743",
      "1",
    ],
    [
      "13789463001701720068644481780139018623810535774918268530883147972470687516235",
      "7909284388362215423874954942356576175208405895570147858713181486416954246620",
      "1",
    ],
  ],
}

export const contractAddress = "0xAD6aab5161C5DC3f20210b2e4B4d01196737F1EF"
export const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_verifier",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256[2]",
        name: "a",
        type: "uint256[2]",
      },
      {
        internalType: "uint256[2][2]",
        name: "b",
        type: "uint256[2][2]",
      },
      {
        internalType: "uint256[2]",
        name: "c",
        type: "uint256[2]",
      },
      {
        internalType: "uint256[48]",
        name: "input",
        type: "uint256[48]",
      },
    ],
    name: "add",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "companies",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "get",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "verifier",
    outputs: [
      {
        internalType: "contract Verifier",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const
