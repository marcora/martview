Ext.namespace('Martview');

Martview.Results = Ext.extend(Ext.Panel, {

  initComponent: function () {

    Ext.applyIf(this, {
      id: 'results',
      ref: '../results',
      region: 'center',
      layout: 'fit',
      iconCls: 'results_icon',
      //       title: 'Results',
      //       tools: [{
      //         id: 'gear',
      //         qtip: 'Customize the results panel'
      //       },
      //       {
      //         id: 'save',
      //         qtip: 'Save the results'
      //       }],
      bbar: [{
        itemId: 'counter',
        ref: '../counterButton'
      }],
      tbar: new Ext.Toolbar({
        cls: 'x-panel-header',
        height: 26,
        items: [{
          itemId: 'select',
          ref: '../selectButton',
          text: '<span style="color:#15428B; font-weight:bold">Results</span>',
          iconCls: 'results_icon',
          cls: 'x-btn-text-icon',
          disabled: true,
          menu: [{
            text: 'Tabular',
            iconCls: 'tabular_view_icon',
            checked: true,
            group: 'view'
          },
          {
            text: 'Itemized',
            iconCls: 'itemized_view_icon',
            group: 'view'
          },
          {
            text: 'Map',
            iconCls: 'map_view_icon',
            group: 'view'
          }]
        },
        '->', {
          itemId: 'customize',
          ref: '../customizeButton',
          text: 'Customize',
          iconCls: 'edit_icon',
          cls: 'x-btn-text-icon',
          disabled: true
        },
        {
          itemId: 'save',
          ref: '../saveButton',
          text: 'Save',
          iconCls: 'save_icon',
          cls: 'x-btn-text-icon',
          disabled: true,
          handler: function () {
            Ext.MessageBox.alert(Martview.APP_TITLE, 'Save results in various formats');
          }
        }]
      })
    });

    // call parent
    Martview.Results.superclass.initComponent.apply(this, arguments);
  },

  enableHeaderButtons: function () {
    var results = this;
    results.selectButton.enable();
    results.customizeButton.enable();
    results.saveButton.enable();
  },

  disableHeaderButtons: function () {
    var results = this;
    results.selectButton.disable();
    results.customizeButton.disable();
    results.saveButton.disable();
  },

  updateCounter: function (message) {
    var results = this;
    results.counterButton.setText(message);
  },

  load: function () {
    var results = this;
    var data = {
      rows: [{
        "ensembl_gene_id": "ENSG00000121410",
        "band_start": "19q13.4",
        "gene_symbol": "A1BG",
        "band_end": "19q13.4",
        "gene_name": "alpha-1-B glycoprotein",
        "gene_type": "protein-coding",
        "chromosome": "19",
        "gene_id_key": 1,
        "chromosome_start_bp": "63548356",
        "entrez_gene_id": "1",
        "chromosome_end_bp": "63556669"
      },
      {
        "ensembl_gene_id": "",
        "band_start": "12p12.3",
        "gene_symbol": "A2M",
        "band_end": "12p13.3",
        "gene_name": "alpha-2-macroglobulin",
        "gene_type": "protein-coding",
        "chromosome": "12",
        "gene_id_key": 2,
        "chromosome_start_bp": "9111571",
        "entrez_gene_id": "2",
        "chromosome_end_bp": "9159825"
      },
      {
        "ensembl_gene_id": "",
        "band_start": "12p12.3",
        "gene_symbol": "A2MP",
        "band_end": "12p13.3",
        "gene_name": "alpha-2-macroglobulin pseudogene",
        "gene_type": "pseudo",
        "chromosome": "12",
        "gene_id_key": 3,
        "chromosome_start_bp": "9275469",
        "entrez_gene_id": "3",
        "chromosome_end_bp": "9278175"
      },
      {
        "ensembl_gene_id": "ENSG00000171428",
        "band_start": "8p21.3",
        "gene_symbol": "NAT1",
        "band_end": "8p23.1",
        "gene_name": "N-acetyltransferase 1 (arylamine N-acetyltransferase)",
        "gene_type": "protein-coding",
        "chromosome": "8",
        "gene_id_key": 4,
        "chromosome_start_bp": "18111895",
        "entrez_gene_id": "9",
        "chromosome_end_bp": "18125100"
      },
      {
        "ensembl_gene_id": "ENSG00000156006",
        "band_start": "8p22",
        "gene_symbol": "NAT2",
        "band_end": "8p22",
        "gene_name": "N-acetyltransferase 2 (arylamine N-acetyltransferase)",
        "gene_type": "protein-coding",
        "chromosome": "8",
        "gene_id_key": 5,
        "chromosome_start_bp": "18293035",
        "entrez_gene_id": "10",
        "chromosome_end_bp": "18303003"
      },
      {
        "ensembl_gene_id": "",
        "band_start": "8p22",
        "gene_symbol": "AACP",
        "band_end": "8p22",
        "gene_name": "arylamide acetylase pseudogene",
        "gene_type": "pseudo",
        "chromosome": "8",
        "gene_id_key": 6,
        "chromosome_start_bp": "18271499",
        "entrez_gene_id": "11",
        "chromosome_end_bp": "18273867"
      },
      {
        "ensembl_gene_id": "ENSG00000196136",
        "band_start": "14q32.1",
        "gene_symbol": "SERPINA3",
        "band_end": "14q32.1",
        "gene_name": "serpin peptidase inhibitor, clade A (alpha-1 antiproteinase, ant",
        "gene_type": "protein-coding",
        "chromosome": "14",
        "gene_id_key": 7,
        "chromosome_start_bp": "94148467",
        "entrez_gene_id": "12",
        "chromosome_end_bp": "94160143"
      },
      {
        "ensembl_gene_id": "ENSG00000114771",
        "band_start": "3q21.3",
        "gene_symbol": "AADAC",
        "band_end": "3q25.2",
        "gene_name": "arylacetamide deacetylase (esterase)",
        "gene_type": "protein-coding",
        "chromosome": "3",
        "gene_id_key": 8,
        "chromosome_start_bp": "153014551",
        "entrez_gene_id": "13",
        "chromosome_end_bp": "153028966"
      },
      {
        "ensembl_gene_id": "ENSG00000127837",
        "band_start": "2q35",
        "gene_symbol": "AAMP",
        "band_end": "2q35",
        "gene_name": "angio-associated, migratory cell protein",
        "gene_type": "protein-coding",
        "chromosome": "2",
        "gene_id_key": 9,
        "chromosome_start_bp": "218837096",
        "entrez_gene_id": "14",
        "chromosome_end_bp": "218843137"
      },
      {
        "ensembl_gene_id": "ENSG00000129673",
        "band_start": "17q25",
        "gene_symbol": "AANAT",
        "band_end": "17q25",
        "gene_name": "arylalkylamine N-acetyltransferase",
        "gene_type": "protein-coding",
        "chromosome": "17",
        "gene_id_key": 10,
        "chromosome_start_bp": "71975246",
        "entrez_gene_id": "15",
        "chromosome_end_bp": "71977794"
      },
      {
        "ensembl_gene_id": "ENSG00000090861",
        "band_start": "16q22",
        "gene_symbol": "AARS",
        "band_end": "16q22",
        "gene_name": "alanyl-tRNA synthetase",
        "gene_type": "protein-coding",
        "chromosome": "16",
        "gene_id_key": 11,
        "chromosome_start_bp": "68843798",
        "entrez_gene_id": "16",
        "chromosome_end_bp": "68880913"
      },
      {
        "ensembl_gene_id": "",
        "band_start": "19q13",
        "gene_symbol": "AAVS1",
        "band_end": "19q13",
        "gene_name": "adeno-associated virus integration site 1",
        "gene_type": "other",
        "chromosome": "19",
        "gene_id_key": 12,
        "chromosome_start_bp": "",
        "entrez_gene_id": "17",
        "chromosome_end_bp": ""
      },
      {
        "ensembl_gene_id": "ENSG00000183044",
        "band_start": "16p13.2",
        "gene_symbol": "ABAT",
        "band_end": "16p13.2",
        "gene_name": "4-aminobutyrate aminotransferase",
        "gene_type": "protein-coding",
        "chromosome": "16",
        "gene_id_key": 13,
        "chromosome_start_bp": "8675928",
        "entrez_gene_id": "18",
        "chromosome_end_bp": "8785933"
      },
      {
        "ensembl_gene_id": "ENSG00000165029",
        "band_start": "9q31.1",
        "gene_symbol": "ABCA1",
        "band_end": "9q31.1",
        "gene_name": "ATP-binding cassette, sub-family A (ABC1), member 1",
        "gene_type": "protein-coding",
        "chromosome": "9",
        "gene_id_key": 14,
        "chromosome_start_bp": "106583104",
        "entrez_gene_id": "19",
        "chromosome_end_bp": "106730257"
      },
      {
        "ensembl_gene_id": "ENSG00000107331",
        "band_start": "9q34",
        "gene_symbol": "ABCA2",
        "band_end": "9q34",
        "gene_name": "ATP-binding cassette, sub-family A (ABC1), member 2",
        "gene_type": "protein-coding",
        "chromosome": "9",
        "gene_id_key": 15,
        "chromosome_start_bp": "139021507",
        "entrez_gene_id": "20",
        "chromosome_end_bp": "139043195"
      },
      {
        "ensembl_gene_id": "ENSG00000167972",
        "band_start": "16p13.3",
        "gene_symbol": "ABCA3",
        "band_end": "16p13.3",
        "gene_name": "ATP-binding cassette, sub-family A (ABC1), member 3",
        "gene_type": "protein-coding",
        "chromosome": "16",
        "gene_id_key": 16,
        "chromosome_start_bp": "2265880",
        "entrez_gene_id": "21",
        "chromosome_end_bp": "2330748"
      },
      {
        "ensembl_gene_id": "ENSG00000131269",
        "band_start": "Xq12",
        "gene_symbol": "ABCB7",
        "band_end": "Xq13",
        "gene_name": "ATP-binding cassette, sub-family B (MDR\/TAP), member 7",
        "gene_type": "protein-coding",
        "chromosome": "X",
        "gene_id_key": 17,
        "chromosome_start_bp": "74189830",
        "entrez_gene_id": "22",
        "chromosome_end_bp": "74292857"
      },
      {
        "ensembl_gene_id": "ENSG00000204574",
        "band_start": "6p21.33",
        "gene_symbol": "ABCF1",
        "band_end": "6p21.33",
        "gene_name": "ATP-binding cassette, sub-family F (GCN20), member 1",
        "gene_type": "protein-coding",
        "chromosome": "6",
        "gene_id_key": 18,
        "chromosome_start_bp": "30647149",
        "entrez_gene_id": "23",
        "chromosome_end_bp": "30667288"
      },
      {
        "ensembl_gene_id": "ENSG00000198691",
        "band_start": "1p21",
        "gene_symbol": "ABCA4",
        "band_end": "1p22.1",
        "gene_name": "ATP-binding cassette, sub-family A (ABC1), member 4",
        "gene_type": "protein-coding",
        "chromosome": "1",
        "gene_id_key": 19,
        "chromosome_start_bp": "94230981",
        "entrez_gene_id": "24",
        "chromosome_end_bp": "94359293"
      },
      {
        "ensembl_gene_id": "ENSG00000097007",
        "band_start": "9q34.1",
        "gene_symbol": "ABL1",
        "band_end": "9q34.1",
        "gene_name": "c-abl oncogene 1, receptor tyrosine kinase",
        "gene_type": "protein-coding",
        "chromosome": "9",
        "gene_id_key": 20,
        "chromosome_start_bp": "132579089",
        "entrez_gene_id": "25",
        "chromosome_end_bp": "132752883"
      },
      {
        "ensembl_gene_id": "ENSG00000002726",
        "band_start": "7q34",
        "gene_symbol": "ABP1",
        "band_end": "7q36",
        "gene_name": "amiloride binding protein 1 (amine oxidase (copper-containing))",
        "gene_type": "protein-coding",
        "chromosome": "7",
        "gene_id_key": 21,
        "chromosome_start_bp": "150180506",
        "entrez_gene_id": "26",
        "chromosome_end_bp": "150189312"
      },
      {
        "ensembl_gene_id": "ENSG00000143322",
        "band_start": "1q24",
        "gene_symbol": "ABL2",
        "band_end": "1q25",
        "gene_name": "v-abl Abelson murine leukemia viral oncogene homolog 2 (arg, Abe",
        "gene_type": "protein-coding",
        "chromosome": "1",
        "gene_id_key": 22,
        "chromosome_start_bp": "177335085",
        "entrez_gene_id": "27",
        "chromosome_end_bp": "177465390"
      },
      {
        "ensembl_gene_id": "ENSG00000175164",
        "band_start": "9q34.1",
        "gene_symbol": "ABO",
        "band_end": "9q34.2",
        "gene_name": "ABO blood group (transferase A, alpha 1-3-N-acetylgalactosaminyl",
        "gene_type": "protein-coding",
        "chromosome": "9",
        "gene_id_key": 23,
        "chromosome_start_bp": "135120384",
        "entrez_gene_id": "28",
        "chromosome_end_bp": "135140451"
      },
      {
        "ensembl_gene_id": "ENSG00000159842",
        "band_start": "17p13.3",
        "gene_symbol": "ABR",
        "band_end": "17p13.3",
        "gene_name": "active BCR-related gene",
        "gene_type": "protein-coding",
        "chromosome": "17",
        "gene_id_key": 24,
        "chromosome_start_bp": "853509",
        "entrez_gene_id": "29",
        "chromosome_end_bp": "1029881"
      },
      {
        "ensembl_gene_id": "ENSG00000060971",
        "band_start": "3p22",
        "gene_symbol": "ACAA1",
        "band_end": "3p23",
        "gene_name": "acetyl-Coenzyme A acyltransferase 1",
        "gene_type": "protein-coding",
        "chromosome": "3",
        "gene_id_key": 25,
        "chromosome_start_bp": "38139211",
        "entrez_gene_id": "30",
        "chromosome_end_bp": "38153619"
      },
      {
        "ensembl_gene_id": "ENSG00000132142",
        "band_start": "17q21",
        "gene_symbol": "ACACA",
        "band_end": "17q21",
        "gene_name": "acetyl-Coenzyme A carboxylase alpha",
        "gene_type": "protein-coding",
        "chromosome": "17",
        "gene_id_key": 26,
        "chromosome_start_bp": "32516040",
        "entrez_gene_id": "31",
        "chromosome_end_bp": "32841015"
      },
      {
        "ensembl_gene_id": "ENSG00000076555",
        "band_start": "12q24.11",
        "gene_symbol": "ACACB",
        "band_end": "12q24.11",
        "gene_name": "acetyl-Coenzyme A carboxylase beta",
        "gene_type": "protein-coding",
        "chromosome": "12",
        "gene_id_key": 27,
        "chromosome_start_bp": "108061585",
        "entrez_gene_id": "32",
        "chromosome_end_bp": "108190414"
      },
      {
        "ensembl_gene_id": "ENSG00000115361",
        "band_start": "2q34",
        "gene_symbol": "ACADL",
        "band_end": "2q35",
        "gene_name": "acyl-Coenzyme A dehydrogenase, long chain",
        "gene_type": "protein-coding",
        "chromosome": "2",
        "gene_id_key": 28,
        "chromosome_start_bp": "210760959",
        "entrez_gene_id": "33",
        "chromosome_end_bp": "210798392"
      },
      {
        "ensembl_gene_id": "ENSG00000117054",
        "band_start": "1p31",
        "gene_symbol": "ACADM",
        "band_end": "1p31",
        "gene_name": "acyl-Coenzyme A dehydrogenase, C-4 to C-12 straight chain",
        "gene_type": "protein-coding",
        "chromosome": "1",
        "gene_id_key": 29,
        "chromosome_start_bp": "75962870",
        "entrez_gene_id": "34",
        "chromosome_end_bp": "76001771"
      },
      {
        "ensembl_gene_id": "ENSG00000122971",
        "band_start": "12qter",
        "gene_symbol": "ACADS",
        "band_end": "12q22",
        "gene_name": "acyl-Coenzyme A dehydrogenase, C-2 to C-3 short chain",
        "gene_type": "protein-coding",
        "chromosome": "12",
        "gene_id_key": 30,
        "chromosome_start_bp": "119648050",
        "entrez_gene_id": "35",
        "chromosome_end_bp": "119662193"
      },
      {
        "ensembl_gene_id": "ENSG00000196177",
        "band_start": "10q26.13",
        "gene_symbol": "ACADSB",
        "band_end": "10q26.13",
        "gene_name": "acyl-Coenzyme A dehydrogenase, short\/branched chain",
        "gene_type": "protein-coding",
        "chromosome": "10",
        "gene_id_key": 31,
        "chromosome_start_bp": "124758419",
        "entrez_gene_id": "36",
        "chromosome_end_bp": "124807796"
      },
      {
        "ensembl_gene_id": "ENSG00000072778",
        "band_start": "17p11",
        "gene_symbol": "ACADVL",
        "band_end": "17p13",
        "gene_name": "acyl-Coenzyme A dehydrogenase, very long chain",
        "gene_type": "protein-coding",
        "chromosome": "17",
        "gene_id_key": 32,
        "chromosome_start_bp": "7063877",
        "entrez_gene_id": "37",
        "chromosome_end_bp": "7069309"
      },
      {
        "ensembl_gene_id": "ENSG00000075239",
        "band_start": "11q22.3",
        "gene_symbol": "ACAT1",
        "band_end": "11q23.1",
        "gene_name": "acetyl-Coenzyme A acetyltransferase 1",
        "gene_type": "protein-coding",
        "chromosome": "11",
        "gene_id_key": 33,
        "chromosome_start_bp": "107497468",
        "entrez_gene_id": "38",
        "chromosome_end_bp": "107523485"
      },
      {
        "ensembl_gene_id": "ENSG00000120437",
        "band_start": "6q25.3",
        "gene_symbol": "ACAT2",
        "band_end": "6q25.3",
        "gene_name": "acetyl-Coenzyme A acetyltransferase 2",
        "gene_type": "protein-coding",
        "chromosome": "6",
        "gene_id_key": 34,
        "chromosome_start_bp": "160102979",
        "entrez_gene_id": "39",
        "chromosome_end_bp": "160120077"
      },
      {
        "ensembl_gene_id": "ENSG00000108684",
        "band_start": "17q12",
        "gene_symbol": "ACCN1",
        "band_end": "17q12",
        "gene_name": "amiloride-sensitive cation channel 1, neuronal",
        "gene_type": "protein-coding",
        "chromosome": "17",
        "gene_id_key": 35,
        "chromosome_start_bp": "28364218",
        "entrez_gene_id": "40",
        "chromosome_end_bp": "29507938"
      },
      {
        "ensembl_gene_id": "ENSG00000110881",
        "band_start": "12q12",
        "gene_symbol": "ACCN2",
        "band_end": "12q12",
        "gene_name": "amiloride-sensitive cation channel 2, neuronal",
        "gene_type": "protein-coding",
        "chromosome": "12",
        "gene_id_key": 36,
        "chromosome_start_bp": "48737754",
        "entrez_gene_id": "41",
        "chromosome_end_bp": "48763661"
      },
      {
        "ensembl_gene_id": "ENSG00000087085",
        "band_start": "7q22",
        "gene_symbol": "ACHE",
        "band_end": "7q22",
        "gene_name": "acetylcholinesterase (Yt blood group)",
        "gene_type": "protein-coding",
        "chromosome": "7",
        "gene_id_key": 37,
        "chromosome_start_bp": "100325551",
        "entrez_gene_id": "43",
        "chromosome_end_bp": "100331477"
      },
      {
        "ensembl_gene_id": "",
        "band_start": "12p11.2",
        "gene_symbol": "ACLS",
        "band_end": "12p13.3",
        "gene_name": "acrocallosal syndrome",
        "gene_type": "unknown",
        "chromosome": "12",
        "gene_id_key": 38,
        "chromosome_start_bp": "",
        "entrez_gene_id": "46",
        "chromosome_end_bp": ""
      },
      {
        "ensembl_gene_id": "ENSG00000131473",
        "band_start": "17q12",
        "gene_symbol": "ACLY",
        "band_end": "17q21",
        "gene_name": "ATP citrate lyase",
        "gene_type": "protein-coding",
        "chromosome": "17",
        "gene_id_key": 39,
        "chromosome_start_bp": "37276705",
        "entrez_gene_id": "47",
        "chromosome_end_bp": "37328798"
      },
      {
        "ensembl_gene_id": "ENSG00000122729",
        "band_start": "9p22",
        "gene_symbol": "ACO1",
        "band_end": "9q32",
        "gene_name": "aconitase 1, soluble",
        "gene_type": "protein-coding",
        "chromosome": "9",
        "gene_id_key": 40,
        "chromosome_start_bp": "32374650",
        "entrez_gene_id": "48",
        "chromosome_end_bp": "32440830"
      },
      {
        "ensembl_gene_id": "ENSG00000100312",
        "band_start": "22qter",
        "gene_symbol": "ACR",
        "band_end": "22q13",
        "gene_name": "acrosin",
        "gene_type": "protein-coding",
        "chromosome": "22",
        "gene_id_key": 41,
        "chromosome_start_bp": "49523518",
        "entrez_gene_id": "49",
        "chromosome_end_bp": "49530593"
      },
      {
        "ensembl_gene_id": "ENSG00000100412",
        "band_start": "22q11.2",
        "gene_symbol": "ACO2",
        "band_end": "22q13.31",
        "gene_name": "aconitase 2, mitochondrial",
        "gene_type": "protein-coding",
        "chromosome": "22",
        "gene_id_key": 42,
        "chromosome_start_bp": "40195075",
        "entrez_gene_id": "50",
        "chromosome_end_bp": "40254939"
      },
      {
        "ensembl_gene_id": "ENSG00000161533",
        "band_start": "17q24",
        "gene_symbol": "ACOX1",
        "band_end": "17q25",
        "gene_name": "acyl-Coenzyme A oxidase 1, palmitoyl",
        "gene_type": "protein-coding",
        "chromosome": "17",
        "gene_id_key": 43,
        "chromosome_start_bp": "71449183",
        "entrez_gene_id": "51",
        "chromosome_end_bp": "71487039"
      },
      {
        "ensembl_gene_id": "ENSG00000143727",
        "band_start": "2p25",
        "gene_symbol": "ACP1",
        "band_end": "2p25",
        "gene_name": "acid phosphatase 1, soluble",
        "gene_type": "protein-coding",
        "chromosome": "2",
        "gene_id_key": 44,
        "chromosome_start_bp": "254872",
        "entrez_gene_id": "52",
        "chromosome_end_bp": "268283"
      },
      {
        "ensembl_gene_id": "ENSG00000134575",
        "band_start": "11p11.11",
        "gene_symbol": "ACP2",
        "band_end": "11p11.2",
        "gene_name": "acid phosphatase 2, lysosomal",
        "gene_type": "protein-coding",
        "chromosome": "11",
        "gene_id_key": 45,
        "chromosome_start_bp": "47217429",
        "entrez_gene_id": "53",
        "chromosome_end_bp": "47226939"
      },
      {
        "ensembl_gene_id": "ENSG00000102575",
        "band_start": "19p13.2",
        "gene_symbol": "ACP5",
        "band_end": "19p13.3",
        "gene_name": "acid phosphatase 5, tartrate resistant",
        "gene_type": "protein-coding",
        "chromosome": "19",
        "gene_id_key": 46,
        "chromosome_start_bp": "11546477",
        "entrez_gene_id": "54",
        "chromosome_end_bp": "11549496"
      },
      {
        "ensembl_gene_id": "ENSG00000014257",
        "band_start": "3q21",
        "gene_symbol": "ACPP",
        "band_end": "3q23",
        "gene_name": "acid phosphatase, prostate",
        "gene_type": "protein-coding",
        "chromosome": "3",
        "gene_id_key": 47,
        "chromosome_start_bp": "133518949",
        "entrez_gene_id": "55",
        "chromosome_end_bp": "133560294"
      },
      {
        "ensembl_gene_id": "ENSG00000134940",
        "band_start": "11q23",
        "gene_symbol": "ACRV1",
        "band_end": "11q24",
        "gene_name": "acrosomal vesicle protein 1",
        "gene_type": "protein-coding",
        "chromosome": "11",
        "gene_id_key": 48,
        "chromosome_start_bp": "125047439",
        "entrez_gene_id": "56",
        "chromosome_end_bp": "125056152"
      },
      {
        "ensembl_gene_id": "ENSG00000143632",
        "band_start": "1q42.13",
        "gene_symbol": "ACTA1",
        "band_end": "1q42.13",
        "gene_name": "actin, alpha 1, skeletal muscle",
        "gene_type": "protein-coding",
        "chromosome": "1",
        "gene_id_key": 49,
        "chromosome_start_bp": "227633615",
        "entrez_gene_id": "58",
        "chromosome_end_bp": "227636466"
      },
      {
        "ensembl_gene_id": "ENSG00000107796",
        "band_start": "10q23.3",
        "gene_symbol": "ACTA2",
        "band_end": "10q23.3",
        "gene_name": "actin, alpha 2, smooth muscle, aorta",
        "gene_type": "protein-coding",
        "chromosome": "10",
        "gene_id_key": 50,
        "chromosome_start_bp": "90684811",
        "entrez_gene_id": "59",
        "chromosome_end_bp": "90702491"
      },
      {
        "ensembl_gene_id": "ENSG00000075624",
        "band_start": "7p12",
        "gene_symbol": "ACTB",
        "band_end": "7p15",
        "gene_name": "actin, beta",
        "gene_type": "protein-coding",
        "chromosome": "7",
        "gene_id_key": 51,
        "chromosome_start_bp": "5533312",
        "entrez_gene_id": "60",
        "chromosome_end_bp": "5536747"
      },
      {
        "ensembl_gene_id": "",
        "band_start": "Xq13",
        "gene_symbol": "ACTBP1",
        "band_end": "Xq22",
        "gene_name": "actin, beta pseudogene 1",
        "gene_type": "pseudo",
        "chromosome": "X",
        "gene_id_key": 52,
        "chromosome_start_bp": "",
        "entrez_gene_id": "61",
        "chromosome_end_bp": ""
      },
      {
        "ensembl_gene_id": "",
        "band_start": "5q14.1",
        "gene_symbol": "ACTBP2",
        "band_end": "5q14.1",
        "gene_name": "actin, beta pseudogene 2",
        "gene_type": "pseudo",
        "chromosome": "5",
        "gene_id_key": 53,
        "chromosome_start_bp": "77116298",
        "entrez_gene_id": "62",
        "chromosome_end_bp": "77118277"
      },
      {
        "ensembl_gene_id": "",
        "band_start": "",
        "gene_symbol": "ACTBP3",
        "band_end": "",
        "gene_name": "actin, beta pseudogene 3",
        "gene_type": "pseudo",
        "chromosome": "18",
        "gene_id_key": 54,
        "chromosome_start_bp": "",
        "entrez_gene_id": "63",
        "chromosome_end_bp": ""
      },
      {
        "ensembl_gene_id": "",
        "band_start": "5q31.1",
        "gene_symbol": "ACTBP4",
        "band_end": "5q31.1",
        "gene_name": "actin, beta pseudogene 4",
        "gene_type": "pseudo",
        "chromosome": "5",
        "gene_id_key": 55,
        "chromosome_start_bp": "131021936",
        "entrez_gene_id": "64",
        "chromosome_end_bp": "131023877"
      },
      {
        "ensembl_gene_id": "",
        "band_start": "7qter",
        "gene_symbol": "ACTBP5",
        "band_end": "7q22",
        "gene_name": "actin, beta pseudogene 5",
        "gene_type": "pseudo",
        "chromosome": "7",
        "gene_id_key": 56,
        "chromosome_start_bp": "",
        "entrez_gene_id": "65",
        "chromosome_end_bp": ""
      },
      {
        "ensembl_gene_id": "",
        "band_start": "",
        "gene_symbol": "ACTBP6",
        "band_end": "",
        "gene_name": "actin, beta pseudogene 6",
        "gene_type": "pseudo",
        "chromosome": "8",
        "gene_id_key": 57,
        "chromosome_start_bp": "",
        "entrez_gene_id": "66",
        "chromosome_end_bp": ""
      },
      {
        "ensembl_gene_id": "",
        "band_start": "15q15.3",
        "gene_symbol": "ACTBP7",
        "band_end": "15q15.3",
        "gene_name": "actin, beta pseudogene 7",
        "gene_type": "pseudo",
        "chromosome": "15",
        "gene_id_key": 58,
        "chromosome_start_bp": "42068454",
        "entrez_gene_id": "67",
        "chromosome_end_bp": "42069774"
      },
      {
        "ensembl_gene_id": "",
        "band_start": "6q13",
        "gene_symbol": "ACTBP8",
        "band_end": "6q13",
        "gene_name": "actin, beta pseudogene 8",
        "gene_type": "pseudo",
        "chromosome": "6",
        "gene_id_key": 59,
        "chromosome_start_bp": "89042098",
        "entrez_gene_id": "68",
        "chromosome_end_bp": "89043958"
      },
      {
        "ensembl_gene_id": "",
        "band_start": "",
        "gene_symbol": "ACTBP9",
        "band_end": "",
        "gene_name": "actin, beta pseudogene 9",
        "gene_type": "pseudo",
        "chromosome": "18",
        "gene_id_key": 60,
        "chromosome_start_bp": "",
        "entrez_gene_id": "69",
        "chromosome_end_bp": ""
      },
      {
        "ensembl_gene_id": "ENSG00000159251",
        "band_start": "15q11",
        "gene_symbol": "ACTC1",
        "band_end": "15q14",
        "gene_name": "actin, alpha, cardiac muscle 1",
        "gene_type": "protein-coding",
        "chromosome": "15",
        "gene_id_key": 61,
        "chromosome_start_bp": "32867589",
        "entrez_gene_id": "70",
        "chromosome_end_bp": "32875219"
      },
      {
        "ensembl_gene_id": "ENSG00000184009",
        "band_start": "17q25",
        "gene_symbol": "ACTG1",
        "band_end": "17q25",
        "gene_name": "actin, gamma 1",
        "gene_type": "protein-coding",
        "chromosome": "17",
        "gene_id_key": 62,
        "chromosome_start_bp": "77091594",
        "entrez_gene_id": "71",
        "chromosome_end_bp": "77094422"
      },
      {
        "ensembl_gene_id": "ENSG00000163017",
        "band_start": "2p13.1",
        "gene_symbol": "ACTG2",
        "band_end": "2p13.1",
        "gene_name": "actin, gamma 2, smooth muscle, enteric",
        "gene_type": "protein-coding",
        "chromosome": "2",
        "gene_id_key": 63,
        "chromosome_start_bp": "73973601",
        "entrez_gene_id": "72",
        "chromosome_end_bp": "74000288"
      },
      {
        "ensembl_gene_id": "",
        "band_start": "3q23",
        "gene_symbol": "ACTGP1",
        "band_end": "3q23",
        "gene_name": "actin, gamma pseudogene 1",
        "gene_type": "pseudo",
        "chromosome": "3",
        "gene_id_key": 64,
        "chromosome_start_bp": "140695273",
        "entrez_gene_id": "73",
        "chromosome_end_bp": "140697223"
      },
      {
        "ensembl_gene_id": "",
        "band_start": "Yq11",
        "gene_symbol": "ACTGP2",
        "band_end": "Yq11",
        "gene_name": "actin, gamma pseudogene 2",
        "gene_type": "pseudo",
        "chromosome": "Y",
        "gene_id_key": 65,
        "chromosome_start_bp": "18377471",
        "entrez_gene_id": "74",
        "chromosome_end_bp": "18379572"
      },
      {
        "ensembl_gene_id": "",
        "band_start": "20p13",
        "gene_symbol": "ACTGP3",
        "band_end": "20p13",
        "gene_name": "actin, gamma pseudogene 3",
        "gene_type": "pseudo",
        "chromosome": "20",
        "gene_id_key": 66,
        "chromosome_start_bp": "1089128",
        "entrez_gene_id": "75",
        "chromosome_end_bp": "1090441"
      },
      {
        "ensembl_gene_id": "",
        "band_start": "1p21",
        "gene_symbol": "ACTGP4",
        "band_end": "1p21",
        "gene_name": "actin, gamma pseudogene 4",
        "gene_type": "pseudo",
        "chromosome": "1",
        "gene_id_key": 67,
        "chromosome_start_bp": "",
        "entrez_gene_id": "76",
        "chromosome_end_bp": ""
      },
      {
        "ensembl_gene_id": "",
        "band_start": "1p21",
        "gene_symbol": "ACTGP5",
        "band_end": "1p21",
        "gene_name": "actin, gamma pseudogene 5",
        "gene_type": "pseudo",
        "chromosome": "1",
        "gene_id_key": 68,
        "chromosome_start_bp": "",
        "entrez_gene_id": "77",
        "chromosome_end_bp": ""
      },
      {
        "ensembl_gene_id": "",
        "band_start": "1p21",
        "gene_symbol": "ACTGP6",
        "band_end": "1p21",
        "gene_name": "actin, gamma pseudogene 6",
        "gene_type": "pseudo",
        "chromosome": "1",
        "gene_id_key": 69,
        "chromosome_start_bp": "",
        "entrez_gene_id": "78",
        "chromosome_end_bp": ""
      },
      {
        "ensembl_gene_id": "",
        "band_start": "1p21",
        "gene_symbol": "ACTGP7",
        "band_end": "1p21",
        "gene_name": "actin, gamma pseudogene 7",
        "gene_type": "pseudo",
        "chromosome": "1",
        "gene_id_key": 70,
        "chromosome_start_bp": "",
        "entrez_gene_id": "79",
        "chromosome_end_bp": ""
      },
      {
        "ensembl_gene_id": "",
        "band_start": "1p21",
        "gene_symbol": "ACTGP8",
        "band_end": "1p21",
        "gene_name": "actin, gamma pseudogene 8",
        "gene_type": "pseudo",
        "chromosome": "1",
        "gene_id_key": 71,
        "chromosome_start_bp": "",
        "entrez_gene_id": "80",
        "chromosome_end_bp": ""
      },
      {
        "ensembl_gene_id": "ENSG00000130402",
        "band_start": "19q13",
        "gene_symbol": "ACTN4",
        "band_end": "19q13",
        "gene_name": "actinin, alpha 4",
        "gene_type": "protein-coding",
        "chromosome": "19",
        "gene_id_key": 72,
        "chromosome_start_bp": "43830167",
        "entrez_gene_id": "81",
        "chromosome_end_bp": "43913010"
      },
      {
        "ensembl_gene_id": "",
        "band_start": "6p12.3",
        "gene_symbol": "ACTGP9",
        "band_end": "6p12.3",
        "gene_name": "actin, gamma pseudogene 9",
        "gene_type": "pseudo",
        "chromosome": "6",
        "gene_id_key": 73,
        "chromosome_start_bp": "46280607",
        "entrez_gene_id": "82",
        "chromosome_end_bp": "46282257"
      },
      {
        "ensembl_gene_id": "",
        "band_start": "Xp11",
        "gene_symbol": "ACTGP10",
        "band_end": "Xq11",
        "gene_name": "actin, gamma pseudogene 10",
        "gene_type": "pseudo",
        "chromosome": "X",
        "gene_id_key": 74,
        "chromosome_start_bp": "53188800",
        "entrez_gene_id": "83",
        "chromosome_end_bp": "53189908"
      },
      {
        "ensembl_gene_id": "",
        "band_start": "3pter",
        "gene_symbol": "ACTL4",
        "band_end": "3q21",
        "gene_name": "actin-like 4",
        "gene_type": "protein-coding",
        "chromosome": "3",
        "gene_id_key": 75,
        "chromosome_start_bp": "",
        "entrez_gene_id": "84",
        "chromosome_end_bp": ""
      },
      {
        "ensembl_gene_id": "",
        "band_start": "21q22.3",
        "gene_symbol": "ACTL5",
        "band_end": "21q22.3",
        "gene_name": "actin-like 5",
        "gene_type": "protein-coding",
        "chromosome": "21",
        "gene_id_key": 76,
        "chromosome_start_bp": "",
        "entrez_gene_id": "85",
        "chromosome_end_bp": ""
      },
      {
        "ensembl_gene_id": "ENSG00000136518",
        "band_start": "3q26.33",
        "gene_symbol": "ACTL6A",
        "band_end": "3q26.33",
        "gene_name": "actin-like 6A",
        "gene_type": "protein-coding",
        "chromosome": "3",
        "gene_id_key": 77,
        "chromosome_start_bp": "180763402",
        "entrez_gene_id": "86",
        "chromosome_end_bp": "180788887"
      },
      {
        "ensembl_gene_id": "ENSG00000072110",
        "band_start": "14q24.1",
        "gene_symbol": "ACTN1",
        "band_end": "14q24.2",
        "gene_name": "actinin, alpha 1",
        "gene_type": "protein-coding",
        "chromosome": "14",
        "gene_id_key": 78,
        "chromosome_start_bp": "68410793",
        "entrez_gene_id": "87",
        "chromosome_end_bp": "68515709"
      },
      {
        "ensembl_gene_id": "ENSG00000077522",
        "band_start": "1q42",
        "gene_symbol": "ACTN2",
        "band_end": "1q43",
        "gene_name": "actinin, alpha 2",
        "gene_type": "protein-coding",
        "chromosome": "1",
        "gene_id_key": 79,
        "chromosome_start_bp": "234916422",
        "entrez_gene_id": "88",
        "chromosome_end_bp": "234993863"
      },
      {
        "ensembl_gene_id": "ENSG00000204633",
        "band_start": "11q13.1",
        "gene_symbol": "ACTN3",
        "band_end": "11q13.1",
        "gene_name": "actinin, alpha 3",
        "gene_type": "protein-coding",
        "chromosome": "11",
        "gene_id_key": 80,
        "chromosome_start_bp": "66070967",
        "entrez_gene_id": "89",
        "chromosome_end_bp": "66087373"
      },
      {
        "ensembl_gene_id": "ENSG00000115170",
        "band_start": "2q23",
        "gene_symbol": "ACVR1",
        "band_end": "2q24",
        "gene_name": "activin A receptor, type I",
        "gene_type": "protein-coding",
        "chromosome": "2",
        "gene_id_key": 81,
        "chromosome_start_bp": "158301207",
        "entrez_gene_id": "90",
        "chromosome_end_bp": "158403036"
      },
      {
        "ensembl_gene_id": "ENSG00000135503",
        "band_start": "12q13",
        "gene_symbol": "ACVR1B",
        "band_end": "12q13",
        "gene_name": "activin A receptor, type IB",
        "gene_type": "protein-coding",
        "chromosome": "12",
        "gene_id_key": 82,
        "chromosome_start_bp": "50631753",
        "entrez_gene_id": "91",
        "chromosome_end_bp": "50677127"
      },
      {
        "ensembl_gene_id": "ENSG00000121989",
        "band_start": "2q22.3",
        "gene_symbol": "ACVR2A",
        "band_end": "2q22.3",
        "gene_name": "activin A receptor, type IIA",
        "gene_type": "protein-coding",
        "chromosome": "2",
        "gene_id_key": 83,
        "chromosome_start_bp": "148319040",
        "entrez_gene_id": "92",
        "chromosome_end_bp": "148404863"
      },
      {
        "ensembl_gene_id": "ENSG00000114739",
        "band_start": "3p22",
        "gene_symbol": "ACVR2B",
        "band_end": "3p22",
        "gene_name": "activin A receptor, type IIB",
        "gene_type": "protein-coding",
        "chromosome": "3",
        "gene_id_key": 84,
        "chromosome_start_bp": "38470794",
        "entrez_gene_id": "93",
        "chromosome_end_bp": "38509637"
      },
      {
        "ensembl_gene_id": "ENSG00000139567",
        "band_start": "12q11",
        "gene_symbol": "ACVRL1",
        "band_end": "12q14",
        "gene_name": "activin A receptor type II-like 1",
        "gene_type": "protein-coding",
        "chromosome": "12",
        "gene_id_key": 85,
        "chromosome_start_bp": "50587469",
        "entrez_gene_id": "94",
        "chromosome_end_bp": "50603412"
      },
      {
        "ensembl_gene_id": "ENSG00000114786",
        "band_start": "3p21.1",
        "gene_symbol": "ACY1",
        "band_end": "3p21.1",
        "gene_name": "aminoacylase 1",
        "gene_type": "protein-coding",
        "chromosome": "3",
        "gene_id_key": 86,
        "chromosome_start_bp": "51992603",
        "entrez_gene_id": "95",
        "chromosome_end_bp": "51998258"
      },
      {
        "ensembl_gene_id": "ENSG00000119640",
        "band_start": "14q24.3",
        "gene_symbol": "ACYP1",
        "band_end": "14q24.3",
        "gene_name": "acylphosphatase 1, erythrocyte (common) type",
        "gene_type": "protein-coding",
        "chromosome": "14",
        "gene_id_key": 87,
        "chromosome_start_bp": "74589677",
        "entrez_gene_id": "97",
        "chromosome_end_bp": "74600489"
      },
      {
        "ensembl_gene_id": "ENSG00000170634",
        "band_start": "2p16.2",
        "gene_symbol": "ACYP2",
        "band_end": "2p16.2",
        "gene_name": "acylphosphatase 2, muscle type",
        "gene_type": "protein-coding",
        "chromosome": "2",
        "gene_id_key": 88,
        "chromosome_start_bp": "54195914",
        "entrez_gene_id": "98",
        "chromosome_end_bp": "54385941"
      },
      {
        "ensembl_gene_id": "ENSG00000196839",
        "band_start": "20q12",
        "gene_symbol": "ADA",
        "band_end": "20q13.11",
        "gene_name": "adenosine deaminase",
        "gene_type": "protein-coding",
        "chromosome": "20",
        "gene_id_key": 89,
        "chromosome_start_bp": "42681577",
        "entrez_gene_id": "100",
        "chromosome_end_bp": "42713790"
      },
      {
        "ensembl_gene_id": "ENSG00000151651",
        "band_start": "10q26.3",
        "gene_symbol": "ADAM8",
        "band_end": "10q26.3",
        "gene_name": "ADAM metallopeptidase domain 8",
        "gene_type": "protein-coding",
        "chromosome": "10",
        "gene_id_key": 90,
        "chromosome_start_bp": "134925911",
        "entrez_gene_id": "101",
        "chromosome_end_bp": "134940362"
      },
      {
        "ensembl_gene_id": "ENSG00000137845",
        "band_start": "15q2",
        "gene_symbol": "ADAM10",
        "band_end": "15q2",
        "gene_name": "ADAM metallopeptidase domain 10",
        "gene_type": "protein-coding",
        "chromosome": "15",
        "gene_id_key": 91,
        "chromosome_start_bp": "56675802",
        "entrez_gene_id": "102",
        "chromosome_end_bp": "56829469"
      },
      {
        "ensembl_gene_id": "ENSG00000160710",
        "band_start": "1q21.1",
        "gene_symbol": "ADAR",
        "band_end": "1q21.2",
        "gene_name": "adenosine deaminase, RNA-specific",
        "gene_type": "protein-coding",
        "chromosome": "1",
        "gene_id_key": 92,
        "chromosome_start_bp": "152821157",
        "entrez_gene_id": "103",
        "chromosome_end_bp": "152867061"
      },
      {
        "ensembl_gene_id": "ENSG00000197381",
        "band_start": "21q22.3",
        "gene_symbol": "ADARB1",
        "band_end": "21q22.3",
        "gene_name": "adenosine deaminase, RNA-specific, B1 (RED1 homolog rat)",
        "gene_type": "protein-coding",
        "chromosome": "21",
        "gene_id_key": 93,
        "chromosome_start_bp": "45318943",
        "entrez_gene_id": "104",
        "chromosome_end_bp": "45470902"
      },
      {
        "ensembl_gene_id": "ENSG00000185736",
        "band_start": "10p15.3",
        "gene_symbol": "ADARB2",
        "band_end": "10p15.3",
        "gene_name": "adenosine deaminase, RNA-specific, B2 (RED2 homolog rat)",
        "gene_type": "protein-coding",
        "chromosome": "10",
        "gene_id_key": 94,
        "chromosome_start_bp": "1218073",
        "entrez_gene_id": "105",
        "chromosome_end_bp": "1769670"
      },
      {
        "ensembl_gene_id": "",
        "band_start": "",
        "gene_symbol": "ADCP1",
        "band_end": "",
        "gene_name": "adenosine deaminase complexing protein 1",
        "gene_type": "unknown",
        "chromosome": "6",
        "gene_id_key": 95,
        "chromosome_start_bp": "",
        "entrez_gene_id": "106",
        "chromosome_end_bp": ""
      },
      {
        "ensembl_gene_id": "ENSG00000164742",
        "band_start": "7p12",
        "gene_symbol": "ADCY1",
        "band_end": "7p13",
        "gene_name": "adenylate cyclase 1 (brain)",
        "gene_type": "protein-coding",
        "chromosome": "7",
        "gene_id_key": 96,
        "chromosome_start_bp": "45580646",
        "entrez_gene_id": "107",
        "chromosome_end_bp": "45729237"
      },
      {
        "ensembl_gene_id": "ENSG00000078295",
        "band_start": "5p15.3",
        "gene_symbol": "ADCY2",
        "band_end": "5p15.3",
        "gene_name": "adenylate cyclase 2 (brain)",
        "gene_type": "protein-coding",
        "chromosome": "5",
        "gene_id_key": 97,
        "chromosome_start_bp": "7449343",
        "entrez_gene_id": "108",
        "chromosome_end_bp": "7883194"
      },
      {
        "ensembl_gene_id": "ENSG00000138031",
        "band_start": "2p23.3",
        "gene_symbol": "ADCY3",
        "band_end": "2p23.3",
        "gene_name": "adenylate cyclase 3",
        "gene_type": "protein-coding",
        "chromosome": "2",
        "gene_id_key": 98,
        "chromosome_start_bp": "24895542",
        "entrez_gene_id": "109",
        "chromosome_end_bp": "24995559"
      },
      {
        "ensembl_gene_id": "ENSG00000173175",
        "band_start": "3q13.2",
        "gene_symbol": "ADCY5",
        "band_end": "3q21",
        "gene_name": "adenylate cyclase 5",
        "gene_type": "protein-coding",
        "chromosome": "3",
        "gene_id_key": 99,
        "chromosome_start_bp": "124486089",
        "entrez_gene_id": "111",
        "chromosome_end_bp": "124650082"
      },
      {
        "ensembl_gene_id": "ENSG00000174233",
        "band_start": "12q12",
        "gene_symbol": "ADCY6",
        "band_end": "12q13",
        "gene_name": "adenylate cyclase 6",
        "gene_type": "protein-coding",
        "chromosome": "12",
        "gene_id_key": 100,
        "chromosome_start_bp": "47446248",
        "entrez_gene_id": "112",
        "chromosome_end_bp": "47469087"
      }]
    };

    // create the data store
    var store = new Ext.data.JsonStore({
      root: 'rows',
      autoDestroy: true,
      fields: [{
        name: 'entrez_gene_id',
        type: 'int'
      },
      {
        name: 'ensembl_gene_id'
      },
      {
        name: 'gene_name'
      },
      {
        name: 'gene_symbol'
      },
      {
        name: 'gene_type'
      },
      {
        name: 'chromosome',
        type: 'int'
      },
      {
        name: 'band_start'
      },
      {
        name: 'band_end'
      },
      {
        name: 'chromosome_start_bp'
      },
      {
        name: 'chromosome_end_bp'
      }]
    });
    store.loadData(data);

    // create the Grid
    var grid = new Ext.grid.GridPanel({
      store: store,
      enableColumnHide: false,
      enableHdMenu: false,
      disableSelection: true,
      columns: [{
        id: 'entrez_gene_id',
        header: "Entrez ID",
        width: 100,
        sortable: true,
        dataIndex: 'entrez_gene_id'
      },
      {
        id: 'ensembl_gene_id',
        header: "ENSEMBL ID",
        width: 100,
        sortable: true,
        dataIndex: 'ensembl_gene_id'
      },
      {
        id: 'gene_name',
        header: "Gene name",
        width: 100,
        sortable: true,
        dataIndex: 'gene_name'
      },
      {
        id: 'gene_symbol',
        header: "Gene symbol",
        width: 100,
        sortable: true,
        dataIndex: 'gene_symbol'
      },
      {
        id: 'chromosome',
        header: "Chromosome",
        width: 100,
        sortable: true,
        dataIndex: 'chromosome'
      }],
      stripeRows: true,
      autoExpandColumn: 'gene_name',
      border: false
    });

    results.removeAll();
    results.add(grid);
    results.doLayout();
  }
});

Ext.reg('results', Martview.Results);
