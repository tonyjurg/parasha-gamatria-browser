export default {
  "schemaVersion": 2,
  "title": "Parasha Gamatria Browser",
  "methods": [
    {
      "id": "hechrechi",
      "label": "Standard · Hechrechi"
    },
    {
      "id": "gadol",
      "label": "Final letters · Gadol"
    },
    {
      "id": "sidduri",
      "label": "Alphabet order · Sidduri"
    },
    {
      "id": "katan",
      "label": "Reduced letters · Katan"
    },
    {
      "id": "katan_mispari",
      "label": "Single digit · Katan Mispari"
    }
  ],
  "sources": {
    "bhsa": {
      "repository": "https://github.com/ETCBC/bhsa",
      "commit": "4db00e2157915495e1a4d3d57e41223df24775da",
      "version": "2021",
      "license": "CC BY-NC 4.0",
      "sha256": {
        "otype.tf": "bb5da974a3b1dd7ff9ddab54dfb533059442642ab830b832a49eea8670aaa920",
        "oslots.tf": "c4efaeed8047d4e75834cc94856d79eacc7a146aea01c34d8be88497d8fa303b",
        "otext.tf": "20c1c41bc602804ecafbf56bfc88541b0af92afcc16fb594db6acfc6f3a846e9",
        "lex_utf8.tf": "21f0dde6d79cdde12558b88ae5e07b5717b1a5f7566d37847c57ff7b53b74627",
        "g_cons_utf8.tf": "1b5a3e41fdadb63e162404fadf83bbebc1ff1a1e016cdee321701ce863c5c87b",
        "g_word_utf8.tf": "504330f4b4dbcfac628e45998796bcf0ba58b0c905c30a8ebdec088b10d692e0",
        "trailer_utf8.tf": "cc9120b92248318cd335a088381e464c0650976ff39027ebe87a99b664567899",
        "qere_utf8.tf": "970fd6e1099e9a8c08ccaa35af896f963d3ad7c7e153fbf833fb36b84efa321e",
        "qere_trailer_utf8.tf": "6aed11605413792577afe76f1f05a05d5bb8f22b47375971e53295aa1e8043e0",
        "languageISO.tf": "2fef1ba1a2ba2cd148369886e0560b4084d0d032568e578f26eb52a366750acd",
        "g_prs_utf8.tf": "738fef4143308de11d69c231d582e88bd26eaa448a23ae7eef6a0bec42724746",
        "book.tf": "2f84c9493bb9a553bb40d7955472673b85933fe0af116299036d33e09d75702a",
        "book@en.tf": "05b0db2eccd7e58aa17ea001b12a0e8ab53204425b9c4aee7b6e91791f20bbe1",
        "chapter.tf": "a09f8a2df52e7d2cec99b251852f9f88a6ecc0ea4a37ad5bd4a7fd3f3f3b2fc9",
        "verse.tf": "ad850b19aae6ecb31c75fa4ff80ad956835e5089d60d37c7d73aa0d5a0893b84",
        "g_cons.tf": "39161c1ba2dc44f19f070fa320cb00dc2c51bbe566f8da4495749b769d1e06a4",
        "g_word.tf": "191726a37db8976ebead3aee8cc01f3520d41bf7ba2fd077b4ca08604e953ca4",
        "g_lex.tf": "3c81d126a2fae0ca67aad0d923c37b3ddfd6b741cf93e96760d196322056b828",
        "g_lex_utf8.tf": "4026b48c461ed5f73d6fd39a36927ae0435f32ddc7abdcba1d00993e1fe68669",
        "lex.tf": "2469664dc71bcde35a916d6a85453a5567cff3dcbc3e3323204e1120bc5ed25a",
        "voc_lex_utf8.tf": "e67e3a0d67205fbb8508faabfc210c59e1475465084ea8bfe88fa160bfb628b3",
        "qere.tf": "3aa63d0061ffe37d22f07f105c187cc96507f859e1867ff2b3b283de4ee2393f",
        "qere_trailer.tf": "a0ee4a58cde242bc5375cb6959c5cbc394b6a7a56ec39f187fcff44aa2c37e26",
        "trailer.tf": "d41a18f54482fc20c615cd207091a40ff8cbd667752b6da25f04fe209f109663",
        "gloss.tf": "b0e94e5e43d6d4305c7321986afbbded1bb980b161a765891b66f40c66434d2e"
      }
    },
    "addons": {
      "repository": "https://github.com/tonyjurg/BHSaddons",
      "commit": "c7a34cba7772519f31889deb0e97a582575940e4",
      "version": "2021",
      "license": "Feature headers: CC BY-NC 4.0; repository: CC BY 4.0",
      "sha256": {
        "parashanum.tf": "dbfa155846d8eef9c2975591d4904671ea069a320091e9343edd6176e4dd2843",
        "parashahebr.tf": "e4183238aa7270b6f71ecf92304d10e04d0614515e767d6dc688751f94d065b4",
        "parashatrans.tf": "716098f776fd8c823c126191fdaca1306a40787de7a66c0118a292c79a1ec575",
        "parashaverse.tf": "81fe55fb00884e5f9f873f88bfc816359886ff79c4e1559e75a1efb04fc22ac1"
      }
    },
    "gematria": {
      "repository": "https://github.com/tonyjurg/gematria_TF",
      "commit": "4465514caa8f7c8800c718a169a0f9cb6e595108",
      "version": "0.2.0",
      "license": "CC BY-NC 4.0",
      "sha256": {
        "gem_full_end_ketiv.tf": "a3f8077d793e9b67c39d226012dcbe9560af1fbc23953209d1e025435af441e5",
        "gem_full_end_qere.tf": "88df18986ed2abe4be0243236b163d3b4c1df1c8f4bea457d9440f68d06a30a6",
        "gem_full_start_ketiv.tf": "9712a5f249b9e59b9fdede61f1ee2cfcacfcbd1e12a0d872434ec352d4712a79",
        "gem_full_start_qere.tf": "bb28d19dee5cdc279103aebe9c181f1b32c8983b4060bb1a7b36113c02218fb4",
        "gem_gadol_full_ketiv_ident.tf": "fe052f128d7e25e21062e4bd3831d1e62269d7ed5e81e6565818b7d309ed9db7",
        "gem_gadol_full_qere_ident.tf": "b9fd7647786bec8d8738ed6bee8811a7e864b5380f9ffd737f698cbb0550830d",
        "gem_gadol_lexeme_ident.tf": "a52d37522caccf0f7993022291dc1ef2263b34bfd47aa3178719f82aa252c920",
        "gem_gadol_word_ketiv_ident.tf": "28bc63c47665757394f6426459aca409705bdb645ecd87661092be761ce8289d",
        "gem_gadol_word_qere_ident.tf": "5723fde149a5c4c43f9be06ab1d116bd895ebf38db5f31b1407f2b535b3dc7bf",
        "gem_has_qere.tf": "f7d15ea4aa3241a935895a53e7854de556cdcbc58aeca1511f26796350c36ffc",
        "gem_hechrechi_full_ketiv_ident.tf": "6520876bbf8b69772b28219d179d48d1198ef4d4bd12a9a67cb2b5cd81d6af8b",
        "gem_hechrechi_full_qere_ident.tf": "37b96e2b22d893337422e6bb36841212c9fb8973219329e68d2f2542eb63bb38",
        "gem_hechrechi_lexeme_ident.tf": "f994cb6fefec9af05ad445080aadedb6c7f25fa43862ed844c68e45f1a985d2c",
        "gem_hechrechi_word_ketiv_ident.tf": "70ba3857901281bac9c3495399ccceb0bc1e679c7ccb6522109c0723582e4e55",
        "gem_hechrechi_word_qere_ident.tf": "50527cfdff9c59973f90d040ccc9c33a4345e79643982938f07940420cabd86c",
        "gem_katan_full_ketiv_ident.tf": "59f14e6fc03f3f70ac69df0c406780e33ddfd8d634a85d7653efcb7b803fdc7a",
        "gem_katan_full_qere_ident.tf": "b76c79868d00d8528ebc3eed6106dcac3b2c2682b3bbb81b781688b29e74f881",
        "gem_katan_lexeme_ident.tf": "c2924b3a2d2fe5089f760f4da9582af95fb0a4d7a0242bb601829893533f676a",
        "gem_katan_mispari_full_ketiv_ident.tf": "6df48a205f273756a64db4d7e674ed8a910821700e14b16e8d145052e308d03c",
        "gem_katan_mispari_full_qere_ident.tf": "b5b3a236fbba39c7acecd73c012be261698cefeb43131e8f2c3ec3567f03031a",
        "gem_katan_mispari_lexeme_ident.tf": "2773e33fd4ff49666e578e57d6f2269160d9eaf1989c91b28608c3fd2a800961",
        "gem_katan_mispari_word_ketiv_ident.tf": "ff9849f02017a69dc0cd18230cf3b0d7c2554c754f4543875e2f47a669632f63",
        "gem_katan_mispari_word_qere_ident.tf": "fe411c2f62051c1c26d542a6a86f6875cb06f48d1b04c3987123b65a37f021cd",
        "gem_katan_word_ketiv_ident.tf": "03376b514f55b21096449a52252e168afae11b5fcabb60a76d399baa0cc7c3eb",
        "gem_katan_word_qere_ident.tf": "ab95e8e5b068818f78cacab6747867b43ce358135375140396149e4cfe72f820",
        "gem_qere_error.tf": "a62e1e36bb4b2054d6dec4638c71de61528f62035140b3f50100efea49a49ab8",
        "gem_sidduri_full_ketiv_ident.tf": "15f200a128c0bb2ab00f543022b08c40344d048025d6f2206552c39874626a8e",
        "gem_sidduri_full_qere_ident.tf": "53397ec5253fcb1ad01d6e0a8d70c6397158a2a3c5e1fd7be2f9cb20924a433b",
        "gem_sidduri_lexeme_ident.tf": "983817fd33e34016f56e0cb610f8b7ad8b61c5d276077d7fca7f500bbd8bc905",
        "gem_sidduri_word_ketiv_ident.tf": "3e15663e8745e97dc29bf7af03aa46aed739032cd1166db85c28c92e14a29bbd",
        "gem_sidduri_word_qere_ident.tf": "c07701ff03aafce76f0f6e2750f53bf30f31dc73b4c0a5c53655828fbc60f531",
        "gem_text_full_ketiv.tf": "9aad8bcecc0129fab8951a66651994a4eff885d9110feb16a6bd631d07d695bc",
        "gem_text_full_qere.tf": "c8141a11c86886600f9d86a9f9117fc11df2ccac8319a2b677cb1b04cd62f6e5",
        "gem_text_lexeme.tf": "cddb71a22c98dfd9dad8aece03f36a10ad9bb2a6e2fa86f8e4b02998773bc21b",
        "gem_text_word_ketiv.tf": "e981820415f6022d277c466c8edba96f3765886f28d0a0d3ffd2e7c2762dadaf",
        "gem_text_word_qere.tf": "474d224b18c85dd9772b6bb7ebff406430121fdbb0c96f847994cecd5c87d411",
        "manifest.json": "276892b68332c18b7ca7328e2d67e81713f1da52ef9101b468a097c45c4f0125"
      }
    }
  },
  "parashot": [
    {
      "id": 1,
      "name": "Bereshit",
      "hebrew": "בְּרֵאשִׁית",
      "range": [
        [
          "Genesis",
          1,
          1
        ],
        [
          "Genesis",
          6,
          8
        ]
      ],
      "verses": 146,
      "words": 2767,
      "file": "01.json",
      "bytes": 343162,
      "sha256": "21f1c4b3cdedbb76e78c4b56d90eb0eef43129ccb0f6f4cf67a3122a4c2d43e5"
    },
    {
      "id": 2,
      "name": "Noach",
      "hebrew": "נֹחַ",
      "range": [
        [
          "Genesis",
          6,
          9
        ],
        [
          "Genesis",
          11,
          32
        ]
      ],
      "verses": 153,
      "words": 2716,
      "file": "02.json",
      "bytes": 343398,
      "sha256": "5845c4c533c4cd5bead4164d6ccb8599d67e71c8273b8e29222b6853cef1942e"
    },
    {
      "id": 3,
      "name": "Lech Lecha",
      "hebrew": "לֶךְ־לְךָ",
      "range": [
        [
          "Genesis",
          12,
          1
        ],
        [
          "Genesis",
          17,
          27
        ]
      ],
      "verses": 126,
      "words": 2317,
      "file": "03.json",
      "bytes": 305250,
      "sha256": "bce43937acadfe4fc44616ea4efc7ea7178b11360d945363281f61ddfaf79761"
    },
    {
      "id": 4,
      "name": "Vayera",
      "hebrew": "וַיֵּרָא",
      "range": [
        [
          "Genesis",
          18,
          1
        ],
        [
          "Genesis",
          22,
          24
        ]
      ],
      "verses": 147,
      "words": 2934,
      "file": "04.json",
      "bytes": 391547,
      "sha256": "c852e4984eaf8736276cc26ff135d60fc4cae49f32bcdad9d8fab435ddf4d0dc"
    },
    {
      "id": 5,
      "name": "Chayei Sarah",
      "hebrew": "חַיֵּי שָֹרָה",
      "range": [
        [
          "Genesis",
          23,
          1
        ],
        [
          "Genesis",
          25,
          18
        ]
      ],
      "verses": 105,
      "words": 1972,
      "file": "05.json",
      "bytes": 275794,
      "sha256": "ce06f3a90fbb71e121379220e03b59a5eb6715148c457908175a9c4e0a933806"
    },
    {
      "id": 6,
      "name": "Toldot",
      "hebrew": "תּוֹלְדוֹת",
      "range": [
        [
          "Genesis",
          25,
          19
        ],
        [
          "Genesis",
          28,
          9
        ]
      ],
      "verses": 106,
      "words": 1963,
      "file": "06.json",
      "bytes": 278685,
      "sha256": "3db8924095971807ec2c7bc3e410838a2e414646255f46af1010d38e5092860f"
    },
    {
      "id": 7,
      "name": "Vayetzei",
      "hebrew": "וַיֵּצֵא",
      "range": [
        [
          "Genesis",
          28,
          10
        ],
        [
          "Genesis",
          32,
          3
        ]
      ],
      "verses": 148,
      "words": 2812,
      "file": "07.json",
      "bytes": 393653,
      "sha256": "150e254e3f9158db51e157671c24cb609ba3c62669385770577307f0160ed41a"
    },
    {
      "id": 8,
      "name": "Vayishlach",
      "hebrew": "וַיִּשְׁלַח",
      "range": [
        [
          "Genesis",
          32,
          4
        ],
        [
          "Genesis",
          36,
          43
        ]
      ],
      "verses": 153,
      "words": 2683,
      "file": "08.json",
      "bytes": 375210,
      "sha256": "5be96b7b9d699e2e0184d99a16afe2c769a76a3b63d506fc387c6eb0a44f5413"
    },
    {
      "id": 9,
      "name": "Vayeshev",
      "hebrew": "וַיֵּשֶׁב",
      "range": [
        [
          "Genesis",
          37,
          1
        ],
        [
          "Genesis",
          40,
          23
        ]
      ],
      "verses": 112,
      "words": 2188,
      "file": "09.json",
      "bytes": 309611,
      "sha256": "ced2f449478f4b257ea7de0195a16a8438220a8e3d135d1038985e4051d525d7"
    },
    {
      "id": 10,
      "name": "Miketz",
      "hebrew": "מִקֵּץ",
      "range": [
        [
          "Genesis",
          41,
          1
        ],
        [
          "Genesis",
          44,
          17
        ]
      ],
      "verses": 146,
      "words": 2804,
      "file": "10.json",
      "bytes": 395003,
      "sha256": "6cb25cd0ad813c985f7dcc62e3100f10903acc7707c3cd2b093e3a6ca0c7cbc4"
    },
    {
      "id": 11,
      "name": "Vayigash",
      "hebrew": "וַיִּגַּשׁ",
      "range": [
        [
          "Genesis",
          44,
          18
        ],
        [
          "Genesis",
          47,
          27
        ]
      ],
      "verses": 106,
      "words": 2050,
      "file": "11.json",
      "bytes": 285660,
      "sha256": "bba0d2948faacc074bad817ef7258087fbd55c852c690f91ba8d1f1b92a13eef"
    },
    {
      "id": 12,
      "name": "Vayechi",
      "hebrew": "וַיְחִי",
      "range": [
        [
          "Genesis",
          47,
          28
        ],
        [
          "Genesis",
          50,
          26
        ]
      ],
      "verses": 85,
      "words": 1558,
      "file": "12.json",
      "bytes": 226525,
      "sha256": "2ec8d570f0651930ca232959f3b22d8d705a1bb527a8ff521748b701b23b8102"
    },
    {
      "id": 13,
      "name": "Shemot",
      "hebrew": "שְׁמוֹת",
      "range": [
        [
          "Exodus",
          1,
          1
        ],
        [
          "Exodus",
          6,
          1
        ]
      ],
      "verses": 124,
      "words": 2508,
      "file": "13.json",
      "bytes": 352650,
      "sha256": "5eb415a904bbd41231a12586cf8bdca68adb4d7a02e404e21837a5c638e028f0"
    },
    {
      "id": 14,
      "name": "Va’era",
      "hebrew": "וָאֵרָא",
      "range": [
        [
          "Exodus",
          6,
          2
        ],
        [
          "Exodus",
          9,
          35
        ]
      ],
      "verses": 121,
      "words": 2512,
      "file": "14.json",
      "bytes": 336095,
      "sha256": "5eedd8d113d8cbbc595b54ee48c8bc833c260eb4100ad2cabcfe0f56cbe49053"
    },
    {
      "id": 15,
      "name": "Bo",
      "hebrew": "בֹּא",
      "range": [
        [
          "Exodus",
          10,
          1
        ],
        [
          "Exodus",
          13,
          16
        ]
      ],
      "verses": 106,
      "words": 2318,
      "file": "15.json",
      "bytes": 315272,
      "sha256": "4c807047dbdfa8562a25762a0d4ae482f9c83eb1f78cb4065886f57e2d5058b3"
    },
    {
      "id": 16,
      "name": "Beshalach",
      "hebrew": "בְּשַׁלַּח",
      "range": [
        [
          "Exodus",
          13,
          17
        ],
        [
          "Exodus",
          17,
          16
        ]
      ],
      "verses": 116,
      "words": 2377,
      "file": "16.json",
      "bytes": 331375,
      "sha256": "bcd3ddeb995e2c0f75c11a05e6cc6bd61118520cba21722968c6805b8d947f1e"
    },
    {
      "id": 17,
      "name": "Yitro",
      "hebrew": "יִתְרוֹ",
      "range": [
        [
          "Exodus",
          18,
          1
        ],
        [
          "Exodus",
          20,
          26
        ]
      ],
      "verses": 78,
      "words": 1536,
      "file": "17.json",
      "bytes": 212381,
      "sha256": "a94de24d751ced60ba40f965801056e5b61298f6ae651a3f8207fdc72e371b66"
    },
    {
      "id": 18,
      "name": "Mishpatim",
      "hebrew": "מִּשְׁפָּטִים",
      "range": [
        [
          "Exodus",
          21,
          1
        ],
        [
          "Exodus",
          24,
          18
        ]
      ],
      "verses": 118,
      "words": 1960,
      "file": "18.json",
      "bytes": 282391,
      "sha256": "8a6c9b615c99839c278766e76d9906a894d783b07ad14660b2001dcd6079444e"
    },
    {
      "id": 19,
      "name": "Terumah",
      "hebrew": "תְּרוּמָה",
      "range": [
        [
          "Exodus",
          25,
          1
        ],
        [
          "Exodus",
          27,
          19
        ]
      ],
      "verses": 96,
      "words": 1693,
      "file": "19.json",
      "bytes": 226119,
      "sha256": "bad45af3a440fe2243a70b768a609d053032512e540bf31f840f513f10434def"
    },
    {
      "id": 20,
      "name": "Tetzaveh",
      "hebrew": "תְּצַוֶּה",
      "range": [
        [
          "Exodus",
          27,
          20
        ],
        [
          "Exodus",
          30,
          10
        ]
      ],
      "verses": 101,
      "words": 2031,
      "file": "20.json",
      "bytes": 270173,
      "sha256": "b88ba137206ea15515652733610460b8859a9573a9b98e9ed8e25631e4c7ab76"
    },
    {
      "id": 21,
      "name": "Ki Tisa",
      "hebrew": "כִּי תִשָּׂא",
      "range": [
        [
          "Exodus",
          30,
          11
        ],
        [
          "Exodus",
          34,
          35
        ]
      ],
      "verses": 139,
      "words": 2802,
      "file": "21.json",
      "bytes": 384611,
      "sha256": "68643830e7a576381cd092d8c01647f834e2fd3a738cc14d742f976fa94bf46d"
    },
    {
      "id": 22,
      "name": "Vayakhel",
      "hebrew": "וַיַּקְהֵ֣ל",
      "range": [
        [
          "Exodus",
          35,
          1
        ],
        [
          "Exodus",
          38,
          20
        ]
      ],
      "verses": 122,
      "words": 2287,
      "file": "22.json",
      "bytes": 298984,
      "sha256": "03b82a5f164b35776cf735a711c7d1c99eb2d71616a08b71e43875ed7b33503e"
    },
    {
      "id": 23,
      "name": "Pekudei",
      "hebrew": "פְקוּדֵי",
      "range": [
        [
          "Exodus",
          38,
          21
        ],
        [
          "Exodus",
          40,
          38
        ]
      ],
      "verses": 92,
      "words": 1724,
      "file": "23.json",
      "bytes": 225879,
      "sha256": "0208794c9e00a3c235483bd9d1db043559fd64f376f84af499373ad76b66d028"
    },
    {
      "id": 24,
      "name": "Vayikra",
      "hebrew": "וַיִּקְרָא",
      "range": [
        [
          "Leviticus",
          1,
          1
        ],
        [
          "Leviticus",
          5,
          26
        ]
      ],
      "verses": 111,
      "words": 2383,
      "file": "24.json",
      "bytes": 307508,
      "sha256": "f1489ef13be00f3e22386711e6160250f674341e3454afa4ddc80b2bce0e4035"
    },
    {
      "id": 25,
      "name": "Tzav",
      "hebrew": "צַו",
      "range": [
        [
          "Leviticus",
          6,
          1
        ],
        [
          "Leviticus",
          8,
          36
        ]
      ],
      "verses": 97,
      "words": 1982,
      "file": "25.json",
      "bytes": 258713,
      "sha256": "3ad7eb29d9fa8311dfaf0cd2b017a512373b4dec474fea1e8b75476289761046"
    },
    {
      "id": 26,
      "name": "Shemini",
      "hebrew": "שְּׁמִינִי",
      "range": [
        [
          "Leviticus",
          9,
          1
        ],
        [
          "Leviticus",
          11,
          47
        ]
      ],
      "verses": 91,
      "words": 1829,
      "file": "26.json",
      "bytes": 243767,
      "sha256": "9c6a64425bd2021dfe76660c6412153c4bb259e46d94aee58664b6216f49491b"
    },
    {
      "id": 27,
      "name": "Tazria",
      "hebrew": "תַזְרִיעַ",
      "range": [
        [
          "Leviticus",
          12,
          1
        ],
        [
          "Leviticus",
          13,
          59
        ]
      ],
      "verses": 67,
      "words": 1503,
      "file": "27.json",
      "bytes": 195253,
      "sha256": "0498c2ed79bd1338aa8cf7eabd328e2bd5a16669b4137cf9f6e08ed4ee1fadbe"
    },
    {
      "id": 28,
      "name": "Metzora",
      "hebrew": "מְּצֹרָע",
      "range": [
        [
          "Leviticus",
          14,
          1
        ],
        [
          "Leviticus",
          15,
          33
        ]
      ],
      "verses": 90,
      "words": 1968,
      "file": "28.json",
      "bytes": 250999,
      "sha256": "6b99a8eb5c7b25bf136f73ff16397d5a084679dfde6e0d0e2257630709a04d77"
    },
    {
      "id": 29,
      "name": "Achrei Mot",
      "hebrew": "אַחֲרֵי מוֹת",
      "range": [
        [
          "Leviticus",
          16,
          1
        ],
        [
          "Leviticus",
          18,
          30
        ]
      ],
      "verses": 80,
      "words": 1646,
      "file": "29.json",
      "bytes": 219956,
      "sha256": "d1a9dbd50bdc93e77b69b6ccbce43992d3bfcc7fce4e746dea3085bc797b829d"
    },
    {
      "id": 30,
      "name": "Kedoshim",
      "hebrew": "קְדשִׁים",
      "range": [
        [
          "Leviticus",
          19,
          1
        ],
        [
          "Leviticus",
          20,
          27
        ]
      ],
      "verses": 64,
      "words": 1144,
      "file": "30.json",
      "bytes": 162491,
      "sha256": "2c6c298e2d385ebc3107c0eac12bf725670454eca3a041b9e3aa14d9db7e8785"
    },
    {
      "id": 31,
      "name": "Emor",
      "hebrew": "אֱמוֹר",
      "range": [
        [
          "Leviticus",
          21,
          1
        ],
        [
          "Leviticus",
          24,
          23
        ]
      ],
      "verses": 124,
      "words": 2195,
      "file": "31.json",
      "bytes": 298568,
      "sha256": "170e4f3469e2a60b900e2c5b2e7fd93be9d4f5e0de47344ca5fe36fdc2133f1c"
    },
    {
      "id": 32,
      "name": "Behar",
      "hebrew": "בְּהַר",
      "range": [
        [
          "Leviticus",
          25,
          1
        ],
        [
          "Leviticus",
          26,
          2
        ]
      ],
      "verses": 57,
      "words": 1018,
      "file": "32.json",
      "bytes": 143097,
      "sha256": "b8915a70cbc42f3947bd0b7ef7182857aff870094e1b7714a0edf6fff4b72846"
    },
    {
      "id": 33,
      "name": "Bechukotai",
      "hebrew": "בְּחֻקֹּתַי",
      "range": [
        [
          "Leviticus",
          26,
          3
        ],
        [
          "Leviticus",
          27,
          34
        ]
      ],
      "verses": 78,
      "words": 1431,
      "file": "33.json",
      "bytes": 203665,
      "sha256": "84984da75bd91c9efdf0510f3b18e508072c925a5e5cabe735fc322322f8101e"
    },
    {
      "id": 34,
      "name": "Bamidbar",
      "hebrew": "בְּמִדְבַּר",
      "range": [
        [
          "Numbers",
          1,
          1
        ],
        [
          "Numbers",
          4,
          20
        ]
      ],
      "verses": 159,
      "words": 2586,
      "file": "34.json",
      "bytes": 327156,
      "sha256": "5e52457bf843bba491236234f1d9f76f0c2abeb6dbf916a4f4ea278b3c77ada2"
    },
    {
      "id": 35,
      "name": "Nasso",
      "hebrew": "נָשׂא",
      "range": [
        [
          "Numbers",
          4,
          21
        ],
        [
          "Numbers",
          7,
          89
        ]
      ],
      "verses": 176,
      "words": 3048,
      "file": "35.json",
      "bytes": 393263,
      "sha256": "46704ea5bc0cc2d973e5d9c6ed4c8d08810a2a921ded7048dfaa1c4f68939ee9"
    },
    {
      "id": 36,
      "name": "Beha’alotcha",
      "hebrew": "בְּהַעֲלֹתְךָ",
      "range": [
        [
          "Numbers",
          8,
          1
        ],
        [
          "Numbers",
          12,
          16
        ]
      ],
      "verses": 136,
      "words": 2618,
      "file": "36.json",
      "bytes": 358930,
      "sha256": "4eca115a04ed6232fecd9180726c7c2190c51df6c24f4bf4ca3854d20a0db567"
    },
    {
      "id": 37,
      "name": "Sh'lach Lecha",
      "hebrew": "שְׁלַח־לְךָ",
      "range": [
        [
          "Numbers",
          13,
          1
        ],
        [
          "Numbers",
          15,
          41
        ]
      ],
      "verses": 119,
      "words": 2199,
      "file": "37.json",
      "bytes": 301587,
      "sha256": "95da48dc05f43f15a894dea94f5c853bf97db458f5cfe0fb4ab306b1b611a41c"
    },
    {
      "id": 38,
      "name": "Korach",
      "hebrew": "קוֹרַח",
      "range": [
        [
          "Numbers",
          16,
          1
        ],
        [
          "Numbers",
          18,
          32
        ]
      ],
      "verses": 95,
      "words": 1944,
      "file": "38.json",
      "bytes": 265355,
      "sha256": "2bf1166687604466bde4ce61300a34986776dd767ca9b865928afc6c5588c67c"
    },
    {
      "id": 39,
      "name": "Chukat",
      "hebrew": "חֻקַּת",
      "range": [
        [
          "Numbers",
          19,
          1
        ],
        [
          "Numbers",
          22,
          1
        ]
      ],
      "verses": 87,
      "words": 1815,
      "file": "39.json",
      "bytes": 248656,
      "sha256": "c75f973634eabfaaf2ff5158e025230906e9e094db07f0344bbe08b5e386338b"
    },
    {
      "id": 40,
      "name": "Balak",
      "hebrew": "בָּלָק",
      "range": [
        [
          "Numbers",
          22,
          2
        ],
        [
          "Numbers",
          25,
          9
        ]
      ],
      "verses": 104,
      "words": 1970,
      "file": "40.json",
      "bytes": 276608,
      "sha256": "6c6d14c3067b1f353071247a74c41bf24d1078f1b0706282a72137fdc778a9a7"
    },
    {
      "id": 41,
      "name": "Pinchas",
      "hebrew": "פִּינְחָס",
      "range": [
        [
          "Numbers",
          25,
          10
        ],
        [
          "Numbers",
          30,
          1
        ]
      ],
      "verses": 169,
      "words": 2767,
      "file": "41.json",
      "bytes": 363176,
      "sha256": "903f77d3c0955c8f8274e36f11b26861beb6924bd5d2d48ad6b29541f6fae148"
    },
    {
      "id": 42,
      "name": "Matot",
      "hebrew": "מַּטּוֹת",
      "range": [
        [
          "Numbers",
          30,
          2
        ],
        [
          "Numbers",
          32,
          42
        ]
      ],
      "verses": 112,
      "words": 2111,
      "file": "42.json",
      "bytes": 281133,
      "sha256": "fecc092a43ac01eae8b695ebfdb6695254453681bb81501ee549dd039ce86d36"
    },
    {
      "id": 43,
      "name": "Masei",
      "hebrew": "מַסְעֵי",
      "range": [
        [
          "Numbers",
          33,
          1
        ],
        [
          "Numbers",
          36,
          13
        ]
      ],
      "verses": 132,
      "words": 2130,
      "file": "43.json",
      "bytes": 291252,
      "sha256": "3a05aca555b25edd266577213d314315db987dc71f8bc8c1389116b637fe1dd2"
    },
    {
      "id": 44,
      "name": "Devarim",
      "hebrew": "דְּבָרִים",
      "range": [
        [
          "Deuteronomy",
          1,
          1
        ],
        [
          "Deuteronomy",
          3,
          22
        ]
      ],
      "verses": 105,
      "words": 2208,
      "file": "44.json",
      "bytes": 303914,
      "sha256": "66e320860dd1bbef5bc43b0b04ef7e49481388fa7cb41511e33154f3c022f4f8"
    },
    {
      "id": 45,
      "name": "Vaetchanan",
      "hebrew": "וָאֶתְחַנַּן",
      "range": [
        [
          "Deuteronomy",
          3,
          23
        ],
        [
          "Deuteronomy",
          7,
          11
        ]
      ],
      "verses": 125,
      "words": 2667,
      "file": "45.json",
      "bytes": 363348,
      "sha256": "cc93c0c1309bd365f7235b0ae22c62bcbe62f058c2176aad93c8d27d0c3c5c41"
    },
    {
      "id": 46,
      "name": "Eikev",
      "hebrew": "עֵקֶב",
      "range": [
        [
          "Deuteronomy",
          7,
          12
        ],
        [
          "Deuteronomy",
          11,
          25
        ]
      ],
      "verses": 111,
      "words": 2475,
      "file": "46.json",
      "bytes": 343484,
      "sha256": "fd8ce86497c92adadac326978a339f0c89d3d0bebfcddc3fafe2ba0eb007fc72"
    },
    {
      "id": 47,
      "name": "Re’eh",
      "hebrew": "רְאֵה",
      "range": [
        [
          "Deuteronomy",
          11,
          26
        ],
        [
          "Deuteronomy",
          16,
          17
        ]
      ],
      "verses": 126,
      "words": 2708,
      "file": "47.json",
      "bytes": 388988,
      "sha256": "7fccc18d2418a56a44d3b5637292a7419f6621dafd95dcfa84795c90ec3763be"
    },
    {
      "id": 48,
      "name": "Shoftim",
      "hebrew": "שׁוֹפְטִים",
      "range": [
        [
          "Deuteronomy",
          16,
          18
        ],
        [
          "Deuteronomy",
          21,
          9
        ]
      ],
      "verses": 97,
      "words": 2124,
      "file": "48.json",
      "bytes": 306404,
      "sha256": "7011418bfb194e2202c20270862cadd383c2b0c61e1610164b84d873c9427bfd"
    },
    {
      "id": 49,
      "name": "Ki Teitzei",
      "hebrew": "כִּי־תֵצֵא",
      "range": [
        [
          "Deuteronomy",
          21,
          10
        ],
        [
          "Deuteronomy",
          25,
          19
        ]
      ],
      "verses": 110,
      "words": 2178,
      "file": "49.json",
      "bytes": 324274,
      "sha256": "c742e23547a91f8207bd2c566d50f501915116a158da0d1c6c0c04a2be3303de"
    },
    {
      "id": 50,
      "name": "Ki Tavo",
      "hebrew": "כִּי־תָבוֹא",
      "range": [
        [
          "Deuteronomy",
          26,
          1
        ],
        [
          "Deuteronomy",
          29,
          8
        ]
      ],
      "verses": 122,
      "words": 2540,
      "file": "50.json",
      "bytes": 366501,
      "sha256": "f2bf1529caeecbf2dcd5450f4d4ffbb6f6825ba99f761de87a99d53aff89bf53"
    },
    {
      "id": 51,
      "name": "Nitzavim",
      "hebrew": "נִצָּבִים",
      "range": [
        [
          "Deuteronomy",
          29,
          9
        ],
        [
          "Deuteronomy",
          30,
          20
        ]
      ],
      "verses": 40,
      "words": 963,
      "file": "51.json",
      "bytes": 139599,
      "sha256": "fea12f5b85968575575688f822c49abf9f50eb96d914ab961c65048658bc7d21"
    },
    {
      "id": 52,
      "name": "Vayeilech",
      "hebrew": "וַיֵּלֶךְ",
      "range": [
        [
          "Deuteronomy",
          31,
          1
        ],
        [
          "Deuteronomy",
          31,
          30
        ]
      ],
      "verses": 30,
      "words": 782,
      "file": "52.json",
      "bytes": 114937,
      "sha256": "7493efe4e554c76a4a0623b2793a51b6c8aa4606c0ccd7126fcb3ced356012bc"
    },
    {
      "id": 53,
      "name": "Ha’azinu",
      "hebrew": "הַאֲזִינוּ",
      "range": [
        [
          "Deuteronomy",
          32,
          1
        ],
        [
          "Deuteronomy",
          32,
          52
        ]
      ],
      "verses": 52,
      "words": 782,
      "file": "53.json",
      "bytes": 129439,
      "sha256": "52d564a3f48b16f881ff34801949a532931148b4730565f9ad61cca2a631831b"
    },
    {
      "id": 54,
      "name": "Vezot Haberakhah",
      "hebrew": "וְזֹאת הַבְּרָכָה",
      "range": [
        [
          "Deuteronomy",
          33,
          1
        ],
        [
          "Deuteronomy",
          34,
          12
        ]
      ],
      "verses": 41,
      "words": 701,
      "file": "54.json",
      "bytes": 110119,
      "sha256": "ba193611518e00f401974ebab5278a5bd59a9311b30773509b4c5acb8bbbd5cc"
    }
  ],
  "sourceVerseCounterAudit": [
    {
      "parasha": 13,
      "missing": 124,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 14,
      "missing": 121,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 15,
      "missing": 106,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 16,
      "missing": 116,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 17,
      "missing": 78,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 18,
      "missing": 118,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 19,
      "missing": 96,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 20,
      "missing": 101,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 21,
      "missing": 139,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 22,
      "missing": 122,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 23,
      "missing": 92,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 24,
      "missing": 111,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 25,
      "missing": 97,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 26,
      "missing": 91,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 27,
      "missing": 67,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 28,
      "missing": 90,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 29,
      "missing": 80,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 30,
      "missing": 64,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 31,
      "missing": 124,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 32,
      "missing": 57,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 33,
      "missing": 78,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 34,
      "missing": 159,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 35,
      "missing": 176,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 36,
      "missing": 136,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 37,
      "missing": 119,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 38,
      "missing": 95,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 39,
      "missing": 87,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 40,
      "missing": 104,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 41,
      "missing": 169,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 42,
      "missing": 112,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 43,
      "missing": 132,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 44,
      "missing": 105,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 45,
      "missing": 125,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 46,
      "missing": 111,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 47,
      "missing": 126,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 48,
      "missing": 97,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 49,
      "missing": 110,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 50,
      "missing": 122,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 51,
      "missing": 40,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 52,
      "missing": 30,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 53,
      "missing": 52,
      "differentFromTextOrder": 0
    },
    {
      "parasha": 54,
      "missing": 41,
      "differentFromTextOrder": 0
    }
  ],
  "license": "CC BY-NC 4.0"
};
