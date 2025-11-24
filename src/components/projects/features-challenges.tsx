'use client'

import { Card, CardContent } from '~/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import { CheckCircle, AlertCircle } from 'lucide-react'

interface FeaturesChallengesProps {
  features: Array<{ text: string }>
  challenges: Array<{ text: string }>
}

export function FeaturesChallenges({
  features,
  challenges,
}: FeaturesChallengesProps) {
  return (
    <Card className="border-neutral-700 bg-neutral-900/50">
      <CardContent className="p-0">
        <Accordion
          type="multiple"
          defaultValue={['features', 'challenges']}
          className="w-full"
        >
          {/* Features */}
          <AccordionItem value="features" className="border-neutral-700">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-400" size={20} />
                <span className="text-lg font-semibold text-white">
                  Key Features
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-neutral-300"
                  >
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-400" />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Challenges */}
          <AccordionItem value="challenges" className="border-neutral-700">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-orange-400" size={20} />
                <span className="text-lg font-semibold text-white">
                  Technical Challenges
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <ul className="space-y-3">
                {challenges.map((challenge, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-neutral-300"
                  >
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-orange-400" />
                    <span>{challenge.text}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
